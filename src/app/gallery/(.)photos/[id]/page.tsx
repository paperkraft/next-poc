import { Metadata } from "next";
import ViewImage from "./ViewImage";

export const metadata: Metadata = {
    title: "Image",
    description: "Intersecpt",
};

export default async function ViewPage({params:{id}} : {params:{id:string}}) {
    return(<ViewImage id={id} />)
}