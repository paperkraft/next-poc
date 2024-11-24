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
    Settings2,
    X,
    Ellipsis
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
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Header from "./Header"
import { defalutMenu, menuType, submenuType, transformMenuData, uniqueLabels } from "./data"
import { ChildProps } from "@/types/types"
import { useForm } from "react-hook-form"
import { FormField } from "@/components/ui/form"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AppSidebar({ children }: ChildProps) {

    const { data } = useSession();
    const [filter, setFilter] = React.useState<menuType[][]>(defalutMenu);
    const [menus, setMenus] = React.useState<menuType[][]>(defalutMenu);

    React.useEffect(() => {
        if (data) {
            const serverMenuData = data?.user?.modules
            const userPermissions = data?.user?.permissions
            const filteredMenuData = transformMenuData(serverMenuData, userPermissions);
            const userMenus: menuType[][] = uniqueLabels
                .map((label) => filteredMenuData
                    .filter((menu) => menu.label === label))
                .filter((menuGroup) => menuGroup.length > 0)
            setFilter(userMenus);
            setMenus(userMenus);
        }
    }, [data]);


    const form = useForm({
        defaultValues: {
            query: ""
        }
    });

    const query = form.watch('query');

    const filterMenu = (query: string) => {

        const lowerCaseQuery = query.toLowerCase();

        function searchSubmenu(submenu: submenuType[], query: string): boolean {
            if (!submenu) return false;
            return submenu.some((item) => {
                return (
                    item.title.toLowerCase().includes(query) ||
                    (item.submenu && searchSubmenu(item.submenu, query))
                );
            });
        }

        const filtered = menus.map((menuItem) => {
            return menuItem.filter((item) => {
                return (
                    item.label.toLowerCase().includes(lowerCaseQuery) ||
                    item.title.toLowerCase().includes(lowerCaseQuery) ||
                    searchSubmenu(item.submenu, lowerCaseQuery)
                );
            })
        }).filter(menuItem => menuItem.length > 0);

        setFilter(filtered);
    };

    React.useEffect(() => {
        if (query) {
            filterMenu(query);
        } else {
            setFilter(menus);
        }
    }, [query])

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="h-16 border-b">
                    <HeaderMenuOptions />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="sticky top-0 z-40 bg-sidebar">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <SidebarGroupContent className="relative">
                                    <SidebarInput
                                        id="search"
                                        placeholder="Search for menu..."
                                        className="px-8"
                                        {...field}
                                    />
                                    <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                                    {
                                        field.value &&
                                        <span className="cursor-pointer absolute right-2 top-1/2 size-4 -translate-y-1/2" onClick={() => form.resetField('query')}>
                                            <X className="size-4" />
                                        </span>
                                    }
                                </SidebarGroupContent>
                            )}
                        />
                    </SidebarGroup>

                    {/* Menus */}

                    {
                        filter.map((data, index) => (
                            <SidebarGroup key={index}>
                                <SidebarGroupLabel>{data.at(0)?.label}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {data.map((item, index) => (
                                        <NestedMenu key={index} item={item} />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        ))
                    }
                    <OtherOptions />
                </SidebarContent>

                <SidebarFooter>
                    <FooterMenuOptions />
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-4 pb-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function HeaderMenuOptions() {
    const route = useRouter();
    return (
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
    const initials = user?.name.split(' ').map((word: any[]) => word[0]).join('').toUpperCase();
    const logout = () => signOut({ redirect: false });

    const options = [
        {
            label: 'Profile',
            url: '/profile',
            icon: UserIcon
        },
        {
            label: 'Setting',
            url: '#',
            icon: Settings2
        },
        {
            label: 'Notifications',
            url: '#',
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
                                <AvatarFallback className="rounded-full">{initials ?? "UN"}</AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user?.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                            <Ellipsis className="ml-auto size-4" />
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
                                    <AvatarFallback className="rounded-full">{initials ?? "UN"}</AvatarFallback>
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
                                options.map((item) => (
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

function OtherOptions() {
    return (
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

function NestedMenu({ item }: { item: menuType }) {

    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const active = item.url === path
        || item?.submenu?.some(subItem => subItem.url === path)
        || item?.submenu?.some(subItem => subItem?.submenu?.some(subSubItem => subSubItem.url === path))

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton tooltip={item.title} asChild onClick={() => isMobile && toggleSidebar()} >
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
                            item?.submenu.map((subItem, index) => (
                                <NestedMenu key={index} item={subItem as menuType} />
                            ))
                        }
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}