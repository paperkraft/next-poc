import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constants";

interface GroupedModule {
    id: string;
    name: string;
    permissions?: number;
    submodules: { id: string; name: string, permissions?: number }[];
  }

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

                const userModulesGrouped = await prisma.modulePermissions.findMany({
                    where: {
                        roleId: user?.roleId,
                    },
                    select: {
                        module: {
                            select: {
                                id: true,
                                name: true,
                                parentId:true
                            },
                        },
                        submodule: {
                            select: {
                                id: true,
                                name: true,
                                parentId:true
                            },
                        },
                        permissions: true,
                    },
                });


                // Grouping modules and submodules
                const groupedModules:GroupedModule[] = userModulesGrouped.reduce((acc:GroupedModule[], permission) => {
                    // Check if the module already exists in the accumulator
                    const existingModule = acc.find(m => m.id === permission.module.id);

                    if (existingModule) {
                        // Add the submodule to the existing module if it exists
                        if (permission.submodule) {
                            existingModule.submodules.push({
                                id: permission.submodule.id,
                                name: permission.submodule.name,
                                permissions: permission.permissions
                            });
                        }
                    } else {
                        // Create a new module object if it doesn't exist yet
                        acc.push({
                            id: permission.module.id,
                            name: permission.module.name,
                            permissions: permission.permissions,
                            submodules: permission.submodule
                                ? [
                                    {
                                        id: permission.submodule.id,
                                        name: permission.submodule.name,
                                        permissions: permission.permissions
                                    },
                                ]
                                : [],
                        });
                    }

                    return acc;
                }, []);

                if (!user || !(await bcrypt.compare(data.password, user.password as string))) {
                    return null
                }

                return {
                    id: user?.id,
                    name: user?.name,
                    email: data.email,
                    roleId: user?.roleId,
                    permissions: user?.role?.permissions,
                    modules: groupedModules
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
        maxAge: 10 * 60,
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