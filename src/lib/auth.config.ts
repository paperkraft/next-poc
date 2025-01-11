import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constants";
import { logAuditAction } from "./audit-log";
import { getIpAddress } from "./utils";
import { fetchModuleByRole } from "@/app/action/module.action";

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
                console.log('Update triggered at JWT');
                const menu = await fetchModuleByRole(session.roleId).then((d) => d.json());
                const updateSession = { ...session, modules: menu.data }
                token = { ...token, user: updateSession }
                return token;
            };
            return token;
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

        async authorized({ request, auth }) {
            if (auth) return true
        }
    },

    pages: { signIn: '/signin' },
}

export default authConfig;