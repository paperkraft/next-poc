import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "@/utils/constants";
import { getIpAddress } from "./utils";
import { fetchModuleByRole } from "@/app/action/module.action";
import { signInSchema } from "./zod";
import { getUser } from "@/app/action/auth.action";

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
                    let user: User | null = null;
                    const { email, password } = await signInSchema.parseAsync(credentials);

                    // GET User details
                    await getUser(email, password).then((data) => {
                        return data ? user = data : null
                    })

                    if (!user) {
                        throw new Error("Invalid credentials.")
                    }

                    return user;
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
                // Fetch menu based on roleId from session
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

            if (!existingUser) {
                return false
            }

            await prisma.user.update({
                where: { email: user.email as string },
                data: {
                    ip: await getIpAddress() ?? undefined
                }
            })

            return true;
        },

        async redirect({ url, baseUrl }) {

            // Check if the callbackUrl exists in the URL
            const urlObj  = new URL(url);

            // If the callbackUrl is present, return it as the redirect destination
            if (urlObj .searchParams.has('callbackUrl')) {
                const callbackUrl = urlObj.searchParams.get('callbackUrl')!;
                return callbackUrl; // Redirect to the original requested URL (callbackUrl)
            }
            // If no callbackUrl exists, redirect to the dashboard
            return `${baseUrl}/dashboard`;
        },
    },

    pages: { signIn: '/signin' },
}

export default authConfig;