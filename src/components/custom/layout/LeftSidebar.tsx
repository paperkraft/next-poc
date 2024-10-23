"use client"

import * as React from "react"
import {
    Bell,
    ChevronRight,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    UserIcon,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Header from "./Header"
import { menus, uniqueLabels } from "./data"
import { ChildProps } from "@/types/types"

export default function LeftSidebar({ children }: ChildProps) {

    const route = useRouter();
    const path = usePathname();
    const { data: session } = useSession();
    const user = session?.user;

    const logout = () => signOut({ redirect: false });

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="border-b">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => route.push('/')} size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                                    WD
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Webdesk
                                    </span>
                                    <span className="truncate text-xs">
                                        Educational ERP
                                    </span>
                                </div>
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
                                    {
                                        data.map((item) => {
                                            const hasSubmenu = item.submenu.length > 0;
                                            const active = item.url === path || item.submenu.some(subItem => subItem.url === path)
                                            return (
                                                <React.Fragment key={item.title}>
                                                    {
                                                        hasSubmenu &&
                                                        <Collapsible
                                                            asChild
                                                            defaultOpen={active}
                                                            className="group/collapsible"
                                                        >
                                                            <SidebarMenuItem>
                                                                <CollapsibleTrigger asChild>
                                                                    <SidebarMenuButton tooltip={item.title}>
                                                                        {item.icon && <item.icon />}
                                                                        <span>{item.title}</span>
                                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                                    </SidebarMenuButton>
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent>
                                                                    <SidebarMenuSub>
                                                                        {item.submenu?.map((subItem) => (
                                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                                <SidebarMenuSubButton asChild>
                                                                                    <Link href={subItem.url} className={cn({ "bg-sidebar-accent text-sidebar-accent-foreground": subItem.url === path })}>
                                                                                        {subItem.title}
                                                                                    </Link>
                                                                                </SidebarMenuSubButton>
                                                                            </SidebarMenuSubItem>
                                                                        ))}
                                                                    </SidebarMenuSub>
                                                                </CollapsibleContent>
                                                            </SidebarMenuItem>
                                                        </Collapsible>
                                                    }
                                                    {
                                                        !hasSubmenu &&
                                                        <SidebarMenuItem key={item.title}>
                                                            <SidebarMenuButton tooltip={item.title} asChild>
                                                                <Link href={item.url} className={cn({ "bg-sidebar-accent text-sidebar-accent-foreground": item.url === path || path.includes(item.url) })}>
                                                                    {item.icon && <item.icon />}
                                                                    {item.title}
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </SidebarMenu>
                            </SidebarGroup>
                        ))
                    }
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                        <Avatar className="h-8 w-8 rounded-full border border-blue-500">
                                            <AvatarImage src={user?.image} alt={user?.name} />
                                            <AvatarFallback className="rounded-full">SV</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {user?.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {user?.email}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:w-5 [&_svg]:stroke-[1.5] [&_svg]:mr-2 [&_svg]:h-5"
                                    side="bottom"
                                    align="start"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-full border border-blue-500">
                                                <AvatarImage src={user?.image} alt={user?.name} />
                                                <AvatarFallback className="rounded-full">SV</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {user?.name}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {user?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link href={'/profile'} className="flex w-full">
                                                <UserIcon /> Profile
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <Link href={'#'} className="flex w-full">
                                                <CreditCard /> Settings
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <Link href={'#'} className="flex w-full">
                                                <Bell /> Notifications
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                                        <LogOut /> Log out
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <Header />
                <Separator />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}