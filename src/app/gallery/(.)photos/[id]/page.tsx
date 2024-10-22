'use client'
import DialogBox from "@/components/custom/dialog-box";
import { ImgProps } from "@/types/types";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"


const Photo = React.memo(({params:{id}} : {params:{id:string}}) => {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [photo, setPhoto] = useState<ImgProps>();

    const handleClose = () => {
        setOpen(false);
        router.back();
    }

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

    return(
        photo &&
        <DialogBox open={open} setClose={handleClose} title={`Image ${id}`} description={photo?.title}>
            <Image src={photo.url} alt="" width={600} height={600} className="rounded aspect-square" />
        </DialogBox>
    )
})

Photo.displayName = "Photo";

export default Photo;