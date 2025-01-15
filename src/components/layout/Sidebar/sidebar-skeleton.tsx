'use client'
import React from "react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from "../../ui/sidebar"

const SidebarSkeleton = React.memo(() => {
    return (
        Array.from({ length: 3 }).map((_, idx) => (
            <SidebarGroup key={idx}>
                <SidebarGroupLabel>
                    <SidebarMenuSkeleton className="w-20 h-3" />
                </SidebarGroupLabel>
                <SidebarMenu>
                    {
                        Array.from({ length: 3 }).map((_, idx) => (
                            <SidebarMenuItem key={idx}>
                                <SidebarMenuSkeleton />
                            </SidebarMenuItem>
                        ))
                    }
                </SidebarMenu>
            </SidebarGroup>
        ))
    )
});

SidebarSkeleton.displayName = 'SidebarSkeleton';
export default SidebarSkeleton;