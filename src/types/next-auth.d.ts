import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User extends NextAuthUser {
        role?: string;
    }
    
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            image?: string;
            role?: string;
        };
    }

    interface Token {
        id: string;
        role?: string;
    }
}
