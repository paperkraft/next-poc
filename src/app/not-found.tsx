import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  description: "Page under construction",
};

export default async function NotFound() {
  const session = await auth();

  return (
    <React.Fragment>
      <div className={cn("flex items-center justify-center h-[calc(100svh-100px)]", {"h-screen": !session})}>
          <div className="flex flex-col items-center gap-1">
              <h6 className="text-2xl font-semibold">Not Found</h6>
              <p className="text-muted-foreground text-sm">The page you are looking does not exist</p>
              <Image src={"/not-found.svg"} height={250} width={250} alt="Not-Found" className="mb-3" />

              <div>
                  <Button asChild>
                    <Link href={'/dashboard'}>Dashboard</Link> 
                  </Button>
              </div>
          </div>
      </div>
    </React.Fragment>
  );
}
