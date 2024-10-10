import { checkIsAuthenticated } from "@/lib/isAuth";
import SignInPage from "./signin";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title:"Sign In" ,
    description: "Signin to get started",
};

export default async function SignIn() {
    const isAuthenticated = await checkIsAuthenticated();
    
    if (isAuthenticated) {
        redirect('/dashboard');
    } else {
        return <SignInPage/>
    }
}