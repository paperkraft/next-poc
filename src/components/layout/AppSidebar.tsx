"use client"

import * as React from "react"
import {
    Bell,
    ChevronRight,
    LifeBuoy,
    LogOut,
    SearchIcon,
    Send,
    UserIcon,
    Settings2,
    X,
    EllipsisVertical,
    Home,
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
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Header from "./Header"
import { menuType, submenuType, transformMenuData } from "./data"
import { ChildProps } from "@/types"
import { useForm } from "react-hook-form"
import { FormField } from "@/components/ui/form"
import { useIsMobile } from "@/hooks/use-mobile"
import { Skeleton } from "../ui/skeleton"
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IModule } from "@/app/_Interface/Module"
import { IGroup } from "@/app/_Interface/Group"
import { toast } from "sonner"
import { groupConfig, menusConfig, userConfig } from "@/hooks/use-config"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

const AppSidebar = ({ children }: ChildProps) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="h-16 border-b">
                        <HeaderMenuOptions />
                    </SidebarHeader>

                    <SidebarContent>
                        <ScrollArea className="h-[100vh]">
                            <RenderMenus />
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </SidebarContent>

                    <SidebarFooter>
                        <FooterMenuOptions />
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset>
                    <Header />
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </QueryClientProvider>
    )
}

const HeaderMenuOptions = () => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Link href={'/dashboard'}>
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
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

const FooterMenuOptions = () => {
    const { data } = useSession();
    const user = data && data?.user;
    const initials = user && user?.name?.split(' ').map((word: any[]) => word[0]).join('').toUpperCase();

    const logout = () => {
        signOut({ redirect: true, redirectTo:'/' });
        localStorage.removeItem("user");
        localStorage.removeItem("groups");
        localStorage.removeItem("menus");
    }

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

    const RenderUserInfo = () => {
        return (
            <>
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
            </>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <RenderUserInfo />
                            <EllipsisVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className={cn("w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:size-4 [&_svg]:stroke-[1.5] [&_svg]:mr-2 mb-2")}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <RenderUserInfo />
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

const OtherOptions = () => {
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

const SkeletonMenuGroup = () => {
    return (
        Array.from({ length: 3 }).map((_, idx) => (
            <SidebarGroup key={idx}>
                <SidebarGroupLabel>
                    <Skeleton className="w-10 h-3" />
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
}

const DashboardMenu = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Home</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={'/dashboard'}>
                            <Home /> Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}

const NestedMenu = React.memo(({ item }: { item: menuType }) => {

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
})

const RenderMenus = () => {

    const { data } = useSession();
    const [filter, setFilter] = React.useState<menuType[][]>();
    const [menus, setMenus] = React.useState<menuType[][]>([]);
    const [, setUserMenu] = menusConfig();

    const fetchGroups = async () => {
        try {
            const response = await fetch('/api/master/group').then((d) => d.json());
            if (response.success) {
                const data: IGroup[] = response.data;
                return data;
            } else {
                toast.error("Error in fecting groups");
                return null
            }
        } catch (error) {
            console.error("Error in fecting groups", error);
            toast.error("Error in fecting groups");
        }
    };

    const fetchMenus = async (roleId:string) => {
        try {
            const response = await fetch(`/api/master/module/${roleId}`).then((d) => d.json());
            if (response.success) {
                const data: IModule[] = response.data;
                setUserMenu(data);
                return data;
            } else {
                toast.error("Error in fecting menus");
                return null
            }
        } catch (error) {
            console.error("Error in fecting menus", error);
            toast.error("Error in fecting menus");
        }
    };

    const {data:groups, isLoading} = useQuery({ queryKey: ["group"], queryFn: fetchGroups });
    const {data:serverMenu, isLoading: isMenuLoading} = useQuery({ queryKey: ["roleMenuAPI", data?.user?.roleId], queryFn: () => data && fetchMenus(data?.user.roleId)} );

    React.useEffect(() => {
        if (groups && serverMenu) {
            const userPermissions = data?.user.permissions

            const filteredMenuData = transformMenuData(serverMenu, userPermissions);
            const userMenus = groups?.map((item) => filteredMenuData
                .filter((menu) => menu.label?.toLowerCase() === item.name?.toLowerCase()))
                .filter((menuGroup) => menuGroup?.length > 0);

            if (userMenus) {
                setFilter(userMenus);
                setMenus(userMenus);
            }
        } else {
            console.log('No group');
        }
    }, [groups, serverMenu]);

    const form = useForm({ defaultValues: { query: "" } });
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

        const filtered = menus?.map((menuItem) => {
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
    }, [query]);

    return (
        <>
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

            {isLoading && isMenuLoading && <SkeletonMenuGroup />}

            {!isLoading && !isMenuLoading && !filter && <DashboardMenu />}

            {
                !isLoading && filter?.map((data, index) => (
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
        </>
    )
}

NestedMenu.displayName = "NestedMenu";
export default AppSidebar;