import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constants";

const authConfig: NextAuthConfig = {
    secret: AUTH_SECRET,

    providers: [
        Credentials({
            name: "Credentails",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials): Promise<User | null> {

                const data = {
                    email: credentials?.email as string,
                    password: credentials?.password as string,
                }

                /* GET User details */
                const user = await prisma.user.findUnique({
                    where: { email: data.email },
                    include: { role: true }
                });

                const userModulesGrouped = await prisma.modulePermission.findMany({
                    where: {
                        roleId: user?.roleId,
                    },
                    select: {
                        module: {
                            select: {
                                id: true,
                                name: true,
                                parentId: true
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

                if (!user || !(await bcrypt.compare(data.password, user.password as string))) {
                    return null
                }

                return {
                    id: user?.id,
                    name: user && `${user?.firstName} ${user?.lastName}`,
                    email: data.email,
                    roleId: user?.roleId,
                    permissions: user?.role?.permissions,
                    modules: formattedJson
                } as User
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
        maxAge: 10 * 60 * 60,
        updateAge: 5 * 60
    },

    callbacks: {
        async signIn({ user, account, profile }) {

            console.log("signIn - user", user,); // info related user
            console.log("signIn - account", account,); // info related auth provider
            console.log("signIn - profile", profile,); // same as user

            const existingUser = await prisma.user.findUnique({
                where: { email: user.email as string }
            });

            if (!existingUser) {
                // add user to database
                // await prisma.user.create({
                //     data: {
                //         email: `${user?.email}`,
                //         name: user?.name || "",
                //         firstName: user?.name?.split(" ")[0] || "",
                //         lastName: user?.name?.split(" ")[1] || "",
                //     }
                // });
            }
            return true;
        },

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