import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User extends NextAuthUser {
        roleId?: string;
        permissions?: number;
        modules?: any;
    }
    
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            image?: string;
            roleId?: string;
            permissions?: number;
            modules?: any;
        };
    }

    interface Token {
        id: string;
        roleId?: string;
        permissions?: number;
        modules?: any;
    }
}
