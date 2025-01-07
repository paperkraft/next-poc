'use client'
import React from "react";
import Link from "next/link"
import { HomeIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar"

const DefaultMenu = React.memo(() => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Home</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={'/dashboard'}>
                            <HomeIcon /> Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
});

DefaultMenu.displayName = 'DefaultMenu';
export default DefaultMenu;