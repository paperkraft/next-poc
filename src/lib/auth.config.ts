import { NextAuthConfig, User } from "next-auth"
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { basePath } from "@/utils/constant";
// import bcrypt from 'bcryptjs';
 
const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            name:"Credentails",
            credentials: {
                token: { label: "token", type: "text" },
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },
            },
            async authorize(credentials):Promise<User | null> {

                const data = {
                    token: credentials?.token as string,
                    email: credentials?.email as string,
                    password : credentials?.password as string,
                }
                const apiUrl = `${basePath}/api/user/`;
                
                try {
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        return null;
                    }
            
                    const user = await response.json();
            
                    if (!user) {
                        return null;
                    }
            
                    return user;
                } catch (error) {
                    console.error('Error during authentication:', error);
                    return null;
                }

                /* GET User details */

                // const user = await prisma.user.findUnique({
                //     where: { email: credentials?.email as string },
                // });
            
                // if (!user || !(await bcrypt.compare(credentials?.password as string, user.password as string))) {
                //     return null
                // }
            
                // return {id:user.id, email: user.email, name:user.name}
            }
        }),

        GitHub({
           name:"GitHub",
           clientId: process.env.AUTH_GITHUB_ID as string,
           clientSecret: process.env.AUTH_GITHUB_SECRET as string,
        })
    ],

    secret: process.env.AUTH_SECRET,

    // basePath: process.env.AUTH_URL,
    
    session: {
        strategy: 'jwt',
        maxAge: 10 * 60,
        updateAge: 5 * 60
    },

    callbacks: {
        async signIn({user, account, profile}){

            console.log("signIn - user", user,); // info related user
            console.log("signIn - account", account,); // info related auth provider
            console.log("signIn - profile", profile,); // same as user
            
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email as string }
            });

            if(!existingUser){
                // add to db
                await prisma.user.create({
                    data:{
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
                return {
                    ...token,
                    id: user.id
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                id: token.id as string

            }
        },
    },

    pages: {
        signIn: '/signin'
    },
}

export default authConfig;