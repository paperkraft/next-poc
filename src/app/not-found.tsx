"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { data: session } = useSession();
  const router = useRouter();

  const RenderPage = () => (
    <div className={cn("flex items-center justify-center",{"h-screen": !session, "h-[calc(100vh-180px)]": session})}>
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
  )

  return (
    <React.Fragment>
      <RenderPage/>
    </React.Fragment>
  );
}
