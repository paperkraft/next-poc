import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Intersecpt",
};

export default async function Page() {

    const images = await fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(data => data.slice(0, 5))

    return(
        <>
            <TitlePage title="Gallery" description="description" />
            <div className="grid grid-cols-5 gap-4 p-4">
                {images.map((item:any) => (
                    <Link href={`/gallery/photos/${item.id}`} passHref key={item.id} className='flex flex-col items-center justify-center'>
                        <Image src={item.thumbnailUrl} height={150} width={150} alt={`${item.id}`} className='rounded-md aspect-square'/>
                        <p className="text-muted-foreground text-sm py-2">Image {item.id}</p>
                    </Link>
                ))}
            </div>
            
        </>
    ) 
}