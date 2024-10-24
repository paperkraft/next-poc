"use client"

import * as React from "react"
import {
    Bell,
    ChevronRight,
    ChevronsUpDown,
    CreditCard,
    LifeBuoy,
    LogOut,
    SearchIcon,
    Send,
    UserIcon,
    Settings2
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
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
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
import { Label } from "@/components/ui/label"

export default function AppSidebar({ children }: ChildProps) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="h-16 border-b">
                    <HeaderMenuOptions/>
                </SidebarHeader>

                <SidebarContent>
                    <SearchMenuOptions/>
                    <ContentMenuOptions/>
                    <OtherOptions/>
                </SidebarContent>

                <SidebarFooter>
                    <FooterMenuOptions/>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function HeaderMenuOptions(){
    const route = useRouter();
    return(
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => route.push('/')} size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
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
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

function FooterMenuOptions() {
    const { data: session } = useSession();
    const user = session?.user;
    const logout = () => signOut({ redirect: false });

    const options = [
        {
            label:'Profile',
            url:'/profile',
            icon: UserIcon
        },
        {
            label:'Setting',
            url:'#',
            icon: Settings2
        },
        {
            label:'Notifications',
            url:'#',
            icon: Bell
        },
    ]

    return (
        user &&
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:size-4 [&_svg]:stroke-[1.5] [&_svg]:mr-2"
                        side="bottom"
                        align="end"
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
                            {
                                options.map((item)=>(
                                    <DropdownMenuItem key={item.label}>
                                        <Link href={item.url} className="flex flex-1 items-center">
                                            {item.icon && <item.icon />}{item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                            <LogOut /> Log out
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

function ContentMenuOptions(){
    const path = usePathname();
    return(
        <>
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
        </>
    )
}

function SearchMenuOptions(){
    return(
        <form>
            <SidebarGroup>
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <SidebarInput
                        id="search"
                        placeholder="Search for menu..."
                        className="pl-8"
                    />
                    <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    )
}

function OtherOptions(){
    return(
        <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="sm">
                            <Link href={'#'}> <LifeBuoy /> Support</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="sm">
                            <Link href={'#'}> <Send /> Feedback</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}