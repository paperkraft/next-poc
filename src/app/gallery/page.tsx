import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import Link from "next/link";
import Image from "next/image";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { getImages } from "@/lib/getImage";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Intercept",
};

// Gallery Component
export default async function Gallery() {
    const images = await getImages();

    if (!images) {
        return <SomethingWentWrong message="Failed to fetch images" />;
    }

    return (
        <>
            <TitlePage title="Gallery" description="Browse through the latest images" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                {images.map((item:any) => (
                    <Link
                        key={item.id}
                        href={`/gallery/${item.id}`}
                        className="flex flex-col items-center justify-center border p-6"
                    >
                        <Image
                            src={item.url}
                            height={150}
                            width={150}
                            alt={`Image ${item.id}`}
                            className="rounded-md aspect-square"
                        />
                        <p className="text-muted-foreground text-sm py-2 truncate w-40">
                            {item.title || "No Title"}
                        </p>
                    </Link>
                ))}
            </div>
        </>
    );
}
