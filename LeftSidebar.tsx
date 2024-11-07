/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { ChevronRight, MenuIcon} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import CompanyLogo from "./CompanyLogo"
import UserAction from "./UserAction"
import Navigation from "./Navigation"
import { menuJson, menus, menuType, uniqueLabels } from "./menu"

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

export default function LeftSidebar({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="border-b">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <CompanyLogo/>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {
                        menus.map((data, index) => (
                            <SidebarGroup key={index}>
                                <SidebarGroupLabel>{uniqueLabels.at(index)}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {data.map((item, index) => (
                                        <Nested key={index} item={item} />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        ))
                    }
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <UserAction/>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <CustomTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Navigation data={menuJson}/>
                        
                    </div>
                </header>
                <Separator />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}


function Nested({ item }: { item: menuType }) {

    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const active = item.url === path
        || item?.submenu?.some(subItem => subItem.url === path)
        || item?.submenu?.some(subItem => subItem?.submenu?.some(subSubItem => subSubItem.url === path))

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url} className={cn({ "bg-sidebar-accent text-sidebar-accent-foreground": item.url === path })}>
                    {item.icon && <item.icon />}
                    {item.title}
                </Link>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={active} className="group/collapsible [&[data-state=open]>button>svg:not(:first-child)]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {
                            item.submenu?.map((subItem:menuType, index) => (
                                <Nested key={index} item={subItem} />
                            ))
                        }
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}