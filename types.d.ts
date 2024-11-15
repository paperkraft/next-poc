declare module "next-auth" {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */

    interface Role {
        id: string
        name: string
        permissions: number
    }

    interface User {
        id: string
        name: string
        email: string
        password: string
        roleId: string
        permissions: number
    }

    interface Session {
        user: {
            roleId: string;
            permissions: number
        } & DefaultSession["user"];
    }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        idToken?: string
    }
}