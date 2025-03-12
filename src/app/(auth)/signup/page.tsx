import SignUpPage from "./signup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"Sign Up" ,
    description: "Signup to get started",
};

export default async function SignUp() {
    return <SignUpPage/>
}