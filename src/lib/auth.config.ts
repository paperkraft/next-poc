import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constant";

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
                    include: {
                        credentials: true
                    }
                });

                if (!user || !(await bcrypt.compare(data.password, user.password as string))) {
                    return null
                }
                return { id: user?.id, name: user?.name, email: data.email }
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
                await prisma.user.create({
                    data: {
                        email: user.email as string,
                        name: user?.name || "",
                        firstName: user?.name?.split(" ")[0] || "",
                        lastName: user?.name?.split(" ")[1] || "",
                    }
                });
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session
        },

        // authorized: async ({ auth }) => {
        //     return !!auth
        // },
    },

    pages: {
        signIn: '/signin'
    },
}

export default authConfig;