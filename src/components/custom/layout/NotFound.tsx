'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className={cn("flex items-center justify-center h-full")}>
            <div className="flex flex-col items-center gap-1">
                <h6 className="text-2xl font-semibold">Not Found</h6>
                <p className="text-muted-foreground text-sm">The page you are looking does not exist</p>
                <Image src={"/not-found.svg"} height={250} width={250} alt="Not-Found" priority className="mb-3" />

                <div className="flex gap-2">
                    <Button onClick={() => router.push('/')}>Home</Button>
                    <Button onClick={() => router.back()}>Back</Button>
                </div>
            </div>
        </div>
    );
}