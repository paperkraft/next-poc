import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User extends NextAuthUser {
        id: number | string;
        email: string;
        name?: string;
        roleId?: number;
        tenantId?: number;
        slug?: string;
        tenantName?: string;
        modules?: any;
        permissions?: number;
    }

    interface Session {
        user: {
            id: number | string;
            email: string;
            name?: string;
            roleId?: number;
            tenantId?: number;
            slug?: string;
            tenantName?: string;
            modules?: any;
        } & DefaultSession["user"];
    }

    interface Token {
        id: number | string;
        email: string;
        name?: string;
        roleId?: number;
        tenantId?: number;
        slug?: string;
        tenantName?: string;
        modules?: any;
        permissions?: number;
    }
}
