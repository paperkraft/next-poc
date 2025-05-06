import SignInPage from "./signin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"Sign In" ,
    description: "Signin to get started",
};

export default function SignIn() {
    return <SignInPage/>
}