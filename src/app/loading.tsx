'use client'
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react"
import { useSession } from "next-auth/react";

export default function Loading() {
  const { data: session } = useSession();
    return(
      <div className={cn("flex justify-center items-center w-full h-full", {'h-screen': !session})}>
        <span className="flex items-center" aria-live="polite">
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    )
}