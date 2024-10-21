"use client"

import * as React from "react"
import {
    Bell,
    BookOpen,
    ChevronRight,
    ChevronsUpDown,
    CreditCard,
    Home,
    ImageIcon,
    LogOut,
    Settings2,
    UserIcon,
    UniversityIcon,
    MenuIcon
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
    DropdownMenuShortcut,
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
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { ChildProps } from "@/types/children"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// This is sample data.
const data = [
    {
        label: "Home",
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        submenu: [],
    },
    {
        label: "Home",
        title: "Gallery",
        url: "/gallery",
        icon: ImageIcon,
        isActive: false,
        submenu: [],
    },
    {
        label: "Home",
        title: "Settings",
        url: "#",
        icon: Settings2,
        isActive: false,
        submenu: [
            {
                title: "General",
                url: "#",
            },
            {
                title: "Access",
                url: "/access-control",
            }
        ],
    },
    {
        label: "Master",
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        isActive: false,
        submenu: [
            {
                title: "Introduction",
                url: "#",
            },
            {
                title: "Get Started",
                url: "#",
            },
            {
                title: "Tutorials",
                url: "#",
            }
        ],
    }
]

function getTitleAndParentByUrl(data: any, url: string) {
    for (const entry of data) {
        // Check if the current entry matches the url
        if (entry.url === url) {
            return { parentTitle: entry.title };
        }

        // Check in submenu if it exists
        if (entry.submenu) {
            const submenuItem = entry.submenu.find((sub:any) => sub.url === url);
            if (submenuItem) {
                return { parentTitle: entry.title, childTitle: submenuItem.title };
            }
        }
    }
    return null;
}

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

export default function LeftSidebar({ children }: ChildProps) {

    const route = useRouter();
    const path = usePathname();
    const { data: session } = useSession();
    const user = session?.user;

    const logout = () => signOut({ redirect: false });

    const uniqueLabels = Array.from(new Set(data.map((menu) => menu.label)));
    const menus = uniqueLabels.map((label) => data.filter((menu) => menu.label === label).map((item) => item));
    
    const breadcrumb = getTitleAndParentByUrl(data, path);

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
                                                                                    <Link href={subItem.url} className={cn({"bg-sidebar-accent text-sidebar-accent-foreground": subItem.url === path})}>
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
                                                                <Link href={item.url} className={cn({"bg-sidebar-accent text-sidebar-accent-foreground": item.url === path})}>
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
                                                <Bell />
                                                Notifications
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                {/* <SidebarRail /> */}

            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <CustomTrigger/>
                        <Separator orientation="vertical" className="mr-2 h-4" />

                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                                </BreadcrumbItem>

                                { path !== '/' && <BreadcrumbSeparator className="hidden md:block" /> }

                                { breadcrumb?.childTitle ?
                                    <React.Fragment>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href={"#"}>{breadcrumb?.parentTitle}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{breadcrumb?.childTitle}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                    : <BreadcrumbPage>{breadcrumb?.parentTitle}</BreadcrumbPage>
                                }
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <Separator />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                    {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}