import AppLayout from "@/components/custom/layout/AppLayout";
import Profile from "./ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Update profile",
};

export default function Page() {
    return <AppLayout><Profile/></AppLayout>
}