import AppLayout from "@/components/custom/layout/AppLayout";
import Profile from "./ProfileForm";
import { Metadata } from "next";
import Gallery from "./Gallery";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Intersecpt",
};

export default function Page() {
    return <AppLayout><Gallery/></AppLayout>
}