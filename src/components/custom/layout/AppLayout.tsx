'use client'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SidebarMenu  from "./Sidebar";
import { cn } from "@/lib/utils";
import React from "react";
import Header from "./Header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function AppLayout({ children }:{children: React.ReactNode}) {
    useSession({
        required: true,
        onUnauthenticated(){
          redirect('/signin')
        }
    });

    return (
        <React.Fragment>
            <Header />
            {
                <aside className="hidden sm:block md:fixed z-50 bg-background">
                    <SidebarMenu />
                </aside>
            }
            <main className={cn("p-4 mt-16 md:ml-56")}>
                <ScrollArea className={cn("h-[calc(100vh-96px)] p-2",{"md:w-[calc(100vw-246px)]":false})} aria-label="scrollarea">
                    <style>
                        {`
                            [data-radix-scroll-area-viewport] > div {
                                display:block !important;
                                min-width: auto !important;
                            }
                        `}
                    </style>
                    {children}
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </main>
        </React.Fragment>
    );
}
export default AppLayout;