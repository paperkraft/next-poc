import { checkIsAuthenticated } from "@/lib/isAuth";
import SignUpPage from "./signup";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title:"Sign Up" ,
    description: "Signup to get started",
};

export default async function SignUp() {
    const isAuthenticated = await checkIsAuthenticated();
    if (isAuthenticated) {
        redirect('/dashboard')
    } else {
        return <SignUpPage/>
    }
}