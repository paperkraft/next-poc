'use cleint'
import React from "react";
import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../../ui/sidebar"
import { cn } from "@/lib/utils";
import { themeConfig } from "@/hooks/use-config";
import AppLogo from "@/components/custom/app-initial";

const SidebarHeaderContent = React.memo(() => {
    const [config] = themeConfig();
    const { isMobile, toggleSidebar } = useSidebar();

    const handleClose = () => { 
        if (isMobile) toggleSidebar();
    }
    
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" 
                    className={cn("data-[state=open]:bg-accent data-[state=open]:text-accent-foreground p-0", 
                        (config.layout === "collapsed" && !isMobile) && "size-8"
                    )}
                    onClick={handleClose}
                >
                    <Link href={'/dashboard'}>
                        <AppLogo/>
                        <span className="font-medium">Demo App</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
});

SidebarHeaderContent.displayName = 'SidebarHeader';
export default SidebarHeaderContent;