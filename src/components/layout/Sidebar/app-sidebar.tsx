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
import { useMounted } from "@/hooks/use-mounted";

const AppSidebar = ({ children }: ChildProps) => {
    const queryClient = new QueryClient();
    const mounted = useMounted();
    return (
        mounted &&
        <QueryClientProvider client={queryClient}>
            <SidebarProvider>
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
        </QueryClientProvider>
    )
}

export default AppSidebar;