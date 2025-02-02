'use cleint'
import React from "react";
import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar"

const SidebarHeaderContent = React.memo(() => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                    <Link href={'/dashboard'}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <span className="text-xs">WD</span>
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                Webdesk
                            </span>
                            <span className="truncate text-xs">
                                Educational ERP
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
});

SidebarHeaderContent.displayName = 'SidebarHeader';
export default SidebarHeaderContent;