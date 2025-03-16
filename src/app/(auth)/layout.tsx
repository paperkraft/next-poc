import AppLogo from "@/components/custom/app-initial";
import { CarouselPlugin } from "@/components/custom/carousel-content";
import { Button } from "@/components/ui/button";
import { ChildProps } from "@/types";
import { RECAPTCHA_SITE_KEY } from "@/utils/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function AuthLayout({ children }: ChildProps) {
  return (
    <>
      <Script
        id="recaptcha"
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      
      <div className="flex h-screen justify-center bg-slate-50 dark:bg-sidebar-accent">
        <div className="w-full flex justify-center items-center h-screen max-w-screen-md">
          <div className="w-full lg:flex rounded-xl bg-card text-card-foreground md:border md:shadow-xl md:max-w-md lg:max-w-3xl">
            {/* side image slider */}
            <div className="hidden lg:w-2/4 lg:block border-r overflow-hidden p-10">
              <div className="text-center flex flex-col w-full h-full gap-4">
                <CarouselPlugin />

                <div className="space-y-4 mt-auto">

                  <div className="flex justify-center items-center gap-2">
                    <AppLogo />Demo App
                  </div>

                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear().toString()}. All Rights Reserved.
                  </p>

                 
                </div>
              </div>
            </div>
            {/* form */}
            <div className="w-full lg:w-3/4 relative overflow-hidden p-10">
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

      <div className="w-full flex justify-center items-center absolute bottom-5">
          <p className="text-muted-foreground text-sm"><span className="text-xs">Designed by:</span> Sannake.Vishal #SV</p>
      </div>
    </>
  );
}
