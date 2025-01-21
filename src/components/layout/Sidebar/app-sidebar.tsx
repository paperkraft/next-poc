"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChildProps } from "@/types"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScrollArea, ScrollBar } from "../../ui/scroll-area"
import Header from "../Header"
import RenderMenus from "./sidebar-menus"
import SidebarHeaderContent from "./sidebar-header"
import SidebarFooterContent from "./sidebar-footer"
import { NotificationsProvider } from "@/context/notification-context";
import { themeConfig } from "@/hooks/use-config";
import { getLightValues } from "@/utils";
import {
    inconsolata,
    inter,
    montserrat,
    noto_sans,
    poppins,
    roboto,
    trio,
} from "@/lib/fonts";

const AppSidebar = ({ children }: ChildProps) => {
    const queryClient = new QueryClient();
    const [open, setOpen] = React.useState(true);
    const [config] = themeConfig();
    const val = getLightValues(config.theme);
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
        // If the meta tag exists, update its content
        themeColorMeta.setAttribute("content", `hsl(${val})`);
    } else {
        // If it doesn't exist, create it
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("name", "theme-color");
        newMeta.setAttribute("content", `hsl(${val})`);
        document.head.appendChild(newMeta);
    }

    React.useEffect(() => {
        if(config.layout === 'navbar'){
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, [config]);

    return (
        <QueryClientProvider client={queryClient}>
            <NotificationsProvider>
                <SidebarProvider 
                    className={`
                        theme-${config.theme}
                        ${inter.variable} 
                        ${roboto.variable} 
                        ${inconsolata.variable} 
                        ${montserrat.variable} 
                        ${noto_sans.variable} 
                        ${trio.variable} 
                        ${poppins.variable}`
                    }

                    style={
                        {
                            "--radius": `${config.radius}rem`,
                            fontFamily: `var(--${config.font})`,
                        } as React.CSSProperties
                    }

                    open={open}
                    onOpenChange={setOpen}
                >
                    <Sidebar>
                        <SidebarHeader className="h-16 border-b">
                            <SidebarHeaderContent />
                        </SidebarHeader>

                        <SidebarContent>
                            <ScrollArea className="h-[100vh]">
                                <RenderMenus />
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </SidebarContent>

                        <SidebarFooter>
                            <SidebarFooterContent />
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset>
                        <Header />
                        <div className="grid grid-rows p-4 gap-3">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </NotificationsProvider>
        </QueryClientProvider>
    )
}

export default AppSidebar;