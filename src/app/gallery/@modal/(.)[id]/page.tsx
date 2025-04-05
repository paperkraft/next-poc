"use client";

import { useRouter } from "next/navigation";
import DialogBox from "@/components/custom/dialog-box";
import Image from "next/image";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { useEffect, useState } from "react";
import { getByIdImage } from "@/lib/getImage";

export default function ViewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;

    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const img = await getByIdImage(id);
                setImage(img);
            } catch (error) {
                console.error("Failed to fetch image", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [id]);

    const handleClose = () => {
        router.back();
    };

    if (loading) return null
    if (!image?.url) return <SomethingWentWrong message="Failed to fetch image" />;

    return (
        <DialogBox open={true} setClose={handleClose} title={`Image ${id}`} description={image.title}>
            <Image src={image.url} alt={image.title || "Image"} width={600} height={600} className="rounded aspect-square" />
        </DialogBox>
    );
}
