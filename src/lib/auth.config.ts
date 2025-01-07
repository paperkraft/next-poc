import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials, { CredentialsProviderType } from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constants";
import { logAuditAction } from "./audit-log";
import { getIpAddress } from "./utils";
import { auth } from "@/auth";

const authConfig: NextAuthConfig = {
    secret: AUTH_SECRET,

    providers: [
        Credentials({
            name: "Credentails",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {

                try {

                    const data = {
                        email: credentials?.email as string,
                        password: credentials?.password as string,
                    }

                    /* GET User details */
                    const user = await prisma.user.findUnique({
                        where: { email: data.email },
                        include: { role: true }
                    });

                    if (user && !(await bcrypt.compare(data.password, user.password as string))) {
                        await logAuditAction('Error', 'auth/signin', { error: 'Invalid credentials' }, user?.id);
                        return null
                    }

                    // await logAuditAction('login', 'auth/signin', { user: `${user?.firstName} ${user?.lastName}` }, user?.id);

                    const userModulesGrouped = await prisma.modulePermission.findMany({
                        where: {
                            roleId: user?.roleId,
                        },
                        select: {
                            module: {
                                select: {
                                    id: true,
                                    name: true,
                                    parentId: true,
                                    group:{
                                        select: {
                                            name: true
                                        }
                                    },
                                },
                            },
                            subModule: {
                                select: {
                                    id: true,
                                    name: true,
                                    parentId: true
                                },
                            },
                            permissions: true,
                        },
                    });

                    const formattedJson = formatToParentChild(userModulesGrouped);

                    return {
                        id: user?.id,
                        name: user && `${user?.firstName} ${user?.lastName}`,
                        email: data.email,
                        roleId: user?.roleId,
                        permissions: user?.role?.permissions,
                        modules: formattedJson
                    } as User
                } catch (error) {
                    console.error("Error during authentication", error);
                    return null;
                }

            }
        }),

        GitHub({
            name: "GitHub",
            clientId: GITHUB_ID as string,
            clientSecret: GITHUB_SECRET as string,
        })
    ],

    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 1 day in seconds
        updateAge: 10 * 60 // 10 minutes in seconds
    },

    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token.id = user?.id;
                token.roleId = user?.roleId;
                token.permissions = user?.permissions;
                token.modules = user?.modules;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.roleId = token.roleId;
                session.user.permissions = token.permissions;
                session.user.modules = token.modules;
            }
            return session;
        },

        async signIn({ user, account, profile }) {

            const existingUser = await prisma.user.findUnique({
                where: { email: user.email as string }
            });

            if (existingUser) {
                await prisma.user.update({
                    where: { email: user.email as string },
                    data: {
                        ip: await getIpAddress() ?? undefined
                    }
                })
            }

            return true;
        },

        authorized: async ({auth}) => {
            console.log('auth', auth);
            return !!auth;
        }
    },

    pages: { signIn: '/signin' },
}

export default authConfig;

interface InputFormat {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    group: string | undefined;
    subModules: InputFormat[] | null;
}

// Function to transform the input into a parent-child hierarchical format
function formatToParentChild(input: any[]): InputFormat[] {
    // A map to store all modules by their id
    const moduleMap: { [key: string]: InputFormat } = {};

    // Step 1: Create a module map where each module/submodule is keyed by id
    input.forEach((item) => {
        const module = item.module;
        const subModule = item.subModule;

        if (!moduleMap[module.id]) {
            moduleMap[module.id] = {
                id: module.id,
                name: module.name,
                parentId: module.parentId,
                permissions: item.permissions,
                group: module.group?.name,
                subModules: []
            };
        }

        // If there is a submodule, process it similarly
        if (subModule) {
            if (!moduleMap[subModule.id]) {
                moduleMap[subModule.id] = {
                    id: subModule.id,
                    name: subModule.name,
                    parentId: subModule.parentId,
                    permissions: item.permissions,
                    group: undefined,
                    subModules: []
                };
            }

            // Add the submodule to the parent module's submodules
            if (moduleMap[subModule.parentId!]) {
                const parentModule = moduleMap[subModule.parentId!];
                if (!parentModule.subModules!.some(s => s.id === subModule.id)) {
                    parentModule.subModules!.push(moduleMap[subModule.id]);
                }
            }
        }
    });

    // Step 2: Extract only the top-level modules (those with no parentId)
    return Object.values(moduleMap).filter(module => module.parentId === null);
}