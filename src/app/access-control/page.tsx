import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    return(
        <>
            <TitlePage title="Access Control" description="Define role access" />
            <AccessPage/>
        </>
    )
}