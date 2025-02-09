import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constants";
import { logAuditAction } from "./audit-log";
import { getIpAddress } from "./utils";
import { fetchModuleByRole } from "@/app/action/module.action";
import { comparePassword } from "@/utils/password";

const authConfig: NextAuthConfig = {
    secret: AUTH_SECRET,

    providers: [
        Credentials({
            name: "Credentails",
            credentials: {
                email: {},
                password: {},
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

                    if (user && !(await comparePassword({ plainPassword: data.password, hashPassword: `${user.password}` }))) {
                        await logAuditAction('Error', 'auth/signin', { error: 'Invalid credentials' }, user?.id);
                        return null
                    }

                    await logAuditAction('login', 'auth/signin', { user: `${user?.firstName} ${user?.lastName}` }, user?.id);

                    const menu = user && await fetchModuleByRole(user.roleId).then((d) => d.json());

                    return {
                        id: user?.id,
                        name: user && `${user?.firstName} ${user?.lastName}`,
                        email: data.email,
                        roleId: user?.roleId,
                        permissions: user?.role?.permissions,
                        modules: menu?.data
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

        async session({ session, token }) {
            session.user = token.user as User;
            return session;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.user = user;
            }

            if (trigger === "update" && session) {
                const menu = await fetchModuleByRole(session.roleId).then((d) => d.json());
                const updateSession = { ...session, modules: menu.data }
                token = { ...token, user: updateSession }
                return token;
            };
            return token;
        },


        async signIn({ user }) {

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

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },

    pages: { signIn: '/signin' },
}

export default authConfig;