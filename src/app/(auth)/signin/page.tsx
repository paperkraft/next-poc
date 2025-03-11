import SignInPage from "./signin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"Sign In" ,
    description: "Signin to get started",
};

export default async function SignIn() {
    return <SignInPage/>
}