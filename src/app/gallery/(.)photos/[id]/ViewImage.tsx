'use client'
import DialogBox from "@/components/custom/dialog-box";
import { ImgProps } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ViewParams = {
    id: string
}

export default function ViewImage({id}:ViewParams) {
    const router = useRouter();
    const [image, setImage] = useState<ImgProps>()

    const getImage = async (id:string) => {
        await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`)
            .then(response => response.json())
            .then(data => setImage(data))
            .catch(error => console.error('Error fetching photos:', error));
    }
    
    useEffect(() => {
        getImage(id)
    },[id])

    const handleClose = () => {
        router.back();
    }

    return(
        image &&
        <DialogBox open={image ? true : false} setClose={handleClose} title={`Image ${id}`} description={image?.title}>
            <Image src={image?.url} alt="" width={600} height={600} className="rounded aspect-square" />
        </DialogBox>
    )
}