'use cleint'
import React from "react";
import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../../ui/sidebar"
import { cn } from "@/lib/utils";
import { themeConfig } from "@/hooks/use-config";

const SidebarHeaderContent = React.memo(() => {
    const [config] = themeConfig();
    const { isMobile } = useSidebar();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" 
                    className={cn("data-[state=open]:bg-accent data-[state=open]:text-accent-foreground p-0", 
                        (config.layout === "collapsed" && !isMobile) && "size-8"
                    )}
                >
                    <Link href={'/dashboard'}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <span className="text-xs">SV</span>
                        </div>
                        <span className="font-medium">Demo App</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
});

SidebarHeaderContent.displayName = 'SidebarHeader';
export default SidebarHeaderContent;