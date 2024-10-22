import AppLayout from "@/components/custom/layout/AppLayout";
import Profile from "./ProfileForm";
import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";

export const metadata: Metadata = {
    title: "Profile",
    description: "Update profile",
};

export default function Page() {
    return(
        <>
            <TitlePage title={"Profile"} description={"This is how others will see you"}/>
            <Profile/>
        </>
    ) 
}