import { CarouselPlugin } from "@/components/custom/carousel-content";
import ToggleButtons from "@/components/custom/layout/ToggleButtons";
import { Button } from "@/components/ui/button";
import { ChildProps } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:{
    default:"Webdesk",
    template:"%s | Auth"
} ,
  description: "Signin to get started",
};

export default function AuthLayout({children}:ChildProps) {
  
  return (
    <div className="flex h-screen justify-center bg-slate-50 dark:bg-sidebar-accent">
      <div className="w-full md:w-[60%] flex justify-center items-center h-screen">
        <div className="w-full lg:flex rounded-xl bg-card text-card-foreground md:border md:shadow-xl">
          {/* side image slider */}
          <div className="hidden w-2/4 lg:flex items-center border-r overflow-hidden p-4">
            <div className="w-full h-full grid">
              <CarouselPlugin/>
              <div className="mt-auto p-4 text-center">
                <div className="flex justify-center items-center gap-2 my-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                        <span className="text-xs">WD</span>
                    </div>
                    Webdesk
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  © 2024, All Rights Reserved.
                </p>
                <ToggleButtons/>
              </div>
            </div>
          </div>
          {/* form */}
          <div className="w-full lg:w-3/4 relative">
            <div className="absolute top-5 right-5">
              <Button variant={'ghost'} size={'sm'} className="group gap-0.5" asChild>
                  <Link href={'/'}>
                    <ChevronLeft className="size-4 transition-transform duration-1000" />
                    <span className="hidden transition-transform duration-1000 group-hover:block">Back</span>
                  </Link>
              </Button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
