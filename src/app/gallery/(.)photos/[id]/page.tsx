'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"
import { ImgProps } from "../../page";


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
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Image {id}</DialogTitle>
                    <DialogDescription>.{photo?.title}</DialogDescription>
                </DialogHeader>
                <Image src={photo.url} alt="" width={600} height={600} className="rounded" />
            </DialogContent>
        </Dialog>
    )
})

Photo.displayName = "Photo";

export default Photo;