"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea, ScrollBar } from "../../ui/scroll-area"
import Header from "../Header"
import SidebarHeaderContent from "./sidebar-header"
import SidebarFooterContent from "./sidebar-footer"
import { NotificationsProvider } from "@/context/notification-context";
import { themeConfig } from "@/hooks/use-config";
import {
    inconsolata,
    inter,
    montserrat,
    noto_sans,
    poppins,
    roboto,
    trio,
} from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { mapMenu, menuType, submenuType } from "./helper";
import NestedMenu, { NestedSubMenu } from "./sidebar-nested-menus";
import { ChevronsLeftIcon, Ellipsis, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import RenderMenus from "./sidebar-menus"

const AppSidebar = ({ children, defaultOpen }: { children: React.ReactNode, defaultOpen: boolean }) => {
    const path = usePathname();
    const isMobile = useIsMobile();
    const { data, status } = useSession();
    const [config] = themeConfig();
    const [menus, setMenus] = React.useState<menuType[][]>([]);

    const [open, setOpen] = React.useState<boolean>(defaultOpen ?? false);
    const [title, setTitle] = React.useState<string>();

    const [query, setQuery] = React.useState<string>('');
    const [submenus, setSubmenus] = React.useState<submenuType[]>([]);
    const [filteredMenus, setFilteredMenus] = React.useState<submenuType[]>([]);

    React.useEffect(() => {
        if (!data?.user?.modules) return;

        const userModules = data.user.modules;
        const formattedMenus = mapMenu(userModules);

        const groupedMenus = formattedMenus.reduce((acc: Record<string, menuType[]>, menu) => {
            acc[menu.label] = acc[menu.label] || [];
            acc[menu.label].push(menu);
            return acc;
        }, {});

        const finalMenus = Object.values(groupedMenus);
        setMenus(finalMenus);
    }, [data]);

    React.useEffect(() => {
        const activeSubmenus = findTopParent(menus, path);
        if (activeSubmenus) {
            setTitle(activeSubmenus.title);
            setSubmenus(activeSubmenus.submenu);
            setFilteredMenus(activeSubmenus.submenu);
            setOpen(true);
        }
        if (path === '/dashboard') {
            setOpen(false);
        }
    }, [path, menus])

    const getActive = (title: string) => {
        setTitle(title);
    }

    const getSubmenus = (submenus: submenuType[]) => {
        setSubmenus(submenus)
        setFilteredMenus(submenus)
    }

    // Recursive search for submenus
    const searchSubmenu = React.useCallback((submenu: submenuType[], query: string): boolean => {
        return submenu.some(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                (item.submenu && searchSubmenu(item.submenu, query))
        );
    }, []);

    React.useEffect(() => {

        if (!query) {
            setFilteredMenus(submenus);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = submenus.filter((item) => (
            item.title.toLowerCase().includes(lowerQuery) ||
            searchSubmenu(item.submenu as submenuType[], lowerQuery)
        ))

        setFilteredMenus(filtered);
    }, [query, menus, searchSubmenu]);

    const isSearching = query.length > 0;

    return (
        <NotificationsProvider>
            <SidebarProvider
                className={`
                    theme-${config.theme}
                    ${inter.variable} 
                    ${roboto.variable} 
                    ${inconsolata.variable} 
                    ${montserrat.variable} 
                    ${noto_sans.variable} 
                    ${trio.variable} 
                    ${poppins.variable}`
                }

                style={
                    {
                        "--radius": `${config.radius}rem`,
                        fontFamily: `var(--${config.font})`,
                    } as React.CSSProperties
                }

                open={open} 
                onOpenChange={setOpen}
            >
                <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row">

                    {/* first sidebar */}

                    <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">

                        <SidebarHeader className="h-16 border-b justify-center">
                            <SidebarHeaderContent />
                        </SidebarHeader>

                        <SidebarContent>
                            {!isMobile && menus?.map((group, index) => (
                                <SidebarGroup key={index}>
                                    <SidebarGroupLabel title={group[0]?.label} className="group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:mt-auto">
                                        <Ellipsis />
                                    </SidebarGroupLabel>
                                    <SidebarMenu>
                                        {group.map((item, index) => (
                                            <NestedMenu key={index} item={item} active={getActive} submenu={getSubmenus} />
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroup>
                            ))}

                            {isMobile && <RenderMenus/>}
                        </SidebarContent>

                        <SidebarFooter>
                            <SidebarFooterContent />
                        </SidebarFooter>
                    </Sidebar>

                    {/* second sidebar */}

                    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                        <SidebarHeader className="p-0">
                            <div className="h-16 flex w-full items-center justify-between border-b p-4">
                                <div className="text-base font-medium text-foreground">
                                    {title}
                                </div>
                                <SidebarClose/>
                            </div>
                            <div className="relative px-2">
                                <SidebarInput
                                    id="search"
                                    placeholder={`Search for ${title}`}
                                    className="focus-within:!ring-primary"
                                    value={query ?? ""}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query &&
                                    <span className="opacity-50 hover:opacity-100 cursor-pointer absolute right-4 top-1/2 size-4 -translate-y-1/2" onClick={() => setQuery('')}>
                                        <X className="size-4" />
                                    </span>}
                            </div>
                        </SidebarHeader>

                        <SidebarContent>
                            <ScrollArea className="h-[100vh]">
                                <SidebarMenu className="mt-1 p-1">
                                    {status !== "loading" && isSearching && filteredMenus?.length === 0 && (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No menu found for "{query}"
                                        </div>
                                    )}
                                    {status !== "loading" && filteredMenus.map((item, idx) => (
                                        <SidebarMenuItem key={idx}>
                                            <NestedSubMenu item={item} isSearchActive={isSearching} level={0} />
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </SidebarContent>

                    </Sidebar>
                </Sidebar>

                <SidebarInset>
                    <Header />
                    <div className={cn("grid grid-rows p-4 gap-4", { "container mx-auto": config.content === 'compact' })}>
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </NotificationsProvider>
    )
}

export default AppSidebar;

function findTopParent(menu: menuType[][], path: string): menuType | null {
    function search(items: submenuType[], parent: menuType | null): menuType | null {
        for (const item of items) {
            if (item.url === path) {
                return parent ?? item as menuType;
            }
            if (item?.submenu && item?.submenu?.length > 0) {
                const result = search(item.submenu, parent ?? item as menuType);
                if (result) return result;
            }
        }
        return null;
    }

    for (const section of menu) {
        for (const item of section) {
            const result = search(item.submenu, item);
            if (result) return result;
        }
    }
    return null;
}

export function SidebarClose() {
    const { setOpen } = useSidebar();
    return <Button onClick={()=> setOpen(false)} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><ChevronsLeftIcon /></Button>
}