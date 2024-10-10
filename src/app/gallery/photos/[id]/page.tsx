'use client'
import { useEffect, useState } from "react";
import { ImgProps } from "../../page";
import Image from "next/image";
import AppLayout from "@/components/custom/layout/AppLayout";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Photos({ params: { id } }: { params: { id: string } }) {
  const [photo, setPhoto] = useState<ImgProps>();
  const router = useRouter();

  useEffect(() => {
    const getImage = async () => {
      await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`)
        .then(response => response.json())
        .then(data => { setPhoto(data) })
        .catch(error => console.error('Error fetching photos:', error));
    }
    getImage();
    return () => { getImage() }
  }, [id])

  return (
    <AppLayout>
      <TitlePage title={`Image ${photo?.id}`} description={`${photo?.title}`} />
      { photo && <Image src={photo.url} alt="" width={400} height={400} className="rounded-md" /> }
      <Button variant={'ghost'} onClick={()=>router.back()} className="mt-4">Back</Button>
    </AppLayout>
  )
}