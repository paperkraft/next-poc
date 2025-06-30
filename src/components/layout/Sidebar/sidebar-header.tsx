'use cleint'
import React from "react";
import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../../ui/sidebar"
import { cn } from "@/lib/utils";
import { themeConfig } from "@/hooks/use-config";
import AppLogo from "@/components/custom/app-initial";
import { useSession } from "next-auth/react";

const SidebarHeaderContent = React.memo(() => {
    const [config] = themeConfig();
    const { isMobile, toggleSidebar } = useSidebar();
    const { data } = useSession();
    const isDual = (config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile

    const handleClose = () => {
        if (isMobile) toggleSidebar();
    }

    const slug = data?.user?.slug ?? "admin";

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg"
                    className={cn("data-[state=open]:bg-accent data-[state=open]:text-accent-foreground p-0",
                        isDual && "size-8"
                    )}

                    onClick={handleClose}
                >
                    <Link href={`/${slug}/dashboard`}>
                        <AppLogo />
                        <span className="font-medium">Demo App</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
});

SidebarHeaderContent.displayName = 'SidebarHeader';
export default SidebarHeaderContent;