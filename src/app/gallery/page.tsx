import { Metadata } from "next";
import Gallery from "./Gallery";
import TitlePage from "@/components/custom/page-heading";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Intersecpt",
};

export default function Page() {
    return(
        <>
            <TitlePage title="Gallery" description="description" />
            <Gallery/>
        </>
    ) 
}