"use client";

import * as React from "react"
import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    useSidebar,
} from "@/components/ui/sidebar"
import Header from "../Header"
import SidebarHeaderContent from "./sidebar-header"
import SidebarFooterContent from "./sidebar-footer"
import { themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import VerticalMenus from "./vertical-sidebar"
import CollapseMenus from "./collapse-sidebar"

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
    const [config] = themeConfig();
    const { isMobile } = useSidebar();
    return (
        <>
            {(config.layout === "vertical" || isMobile) &&
                <Sidebar>
                    <SidebarHeader className="h-16 border-b justify-center">
                        <SidebarHeaderContent />
                    </SidebarHeader>

                    <VerticalMenus />

                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>
            }

            {(config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile &&
                <CollapseMenus />
            }

            <SidebarInset>
                <Header />
                <div className={cn("grid grid-rows p-4 gap-4 w-full", { "container px-8": config.content === 'compact' })}>
                    {children}
                </div>
            </SidebarInset>
        </>
    )
}

export default AppSidebar;