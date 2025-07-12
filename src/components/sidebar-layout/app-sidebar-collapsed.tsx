'use client'

import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ChevronsLeftIcon, EllipsisIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { themeConfig } from "@/hooks/use-config";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CollapseMenus } from "./collapse/collapse-menus";
import { CollapseSubmenus } from "./collapse/collapse-submenu";

import SidebarHeaderContent from "./app-sidebar-header";
import SidebarFooterContent from "./app-sidebar-footer";

import { useMounted } from "@/hooks/use-mounted";
import { GroupedMenus, MenuItem } from "@/lib/menus";
import { findTopParent } from "./helper";


const SidebarCollapseMenus = React.memo(({ menus = [] }: { menus: GroupedMenus[] }) => {
    const mounted = useMounted();

    const path = usePathname();
    const [config] = themeConfig();

    const { status } = useSession();

    const [query, setQuery] = React.useState<string>('');
    const debouncedQuery = useDebounce(query, 300);

    const isSearching = query.length > 0;
    const isDual = config.layout === "dual-menu";

    const [title, setTitle] = React.useState<string>('');
    const [submenus, setSubmenus] = React.useState<MenuItem[]>([]);
    const { setOpen } = useSidebar();

    // Update sidebar state on route change
    React.useEffect(() => {
        const activeSubmenus = findTopParent(menus, path);

        if (activeSubmenus) {
            setTitle(activeSubmenus.name);
            setSubmenus(activeSubmenus.children);
            if (config.layout === 'vertical' || config.layout === 'dual-menu') {
                setOpen(true);
            } else {
                setOpen(false);
            }
        } else if (path === '/dashboard' && config.layout !== 'vertical' && config.layout !== 'dual-menu') {
            setOpen(false);
        } else {
            setOpen(false);
        }
    }, [path, menus, config]);


    const searchModules = React.useCallback((modules: MenuItem[], query: string): boolean => {
        return modules.some(
            item =>
                item.name.toLowerCase().includes(query) ||
                (item.children && searchModules(item.children, query))
        );
    }, []);

    // Filtered menus based on search query
    const filteredSubmenus = React.useMemo(() => {
        if (!debouncedQuery) return submenus;
        const lowerQuery = debouncedQuery.toLowerCase();
        return submenus.filter((item) => (
            item.name.toLowerCase().includes(lowerQuery) ||
            searchModules(item.children || [], lowerQuery)
        ))
    }, [debouncedQuery, submenus, searchModules]);

    if (!mounted) return null

    return (
        <>
            <Sidebar collapsible="icon" className={cn("overflow-hidden [&>[data-sidebar=sidebar]]:flex-row")}>
                {/* Icons */}
                <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
                    <SidebarHeader className="h-16 border-b justify-center">
                        <SidebarHeaderContent />
                    </SidebarHeader>
                    <SidebarContent>
                        {menus?.map((group, index) => (
                            <SidebarGroup key={index} className="svclass">
                                <SidebarGroupLabel title={group.groupName} className="group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:mt-auto">
                                    <EllipsisIcon />
                                </SidebarGroupLabel>
                                <SidebarMenu>
                                    {group.modules.map((item, index) => (
                                        <CollapseMenus
                                            key={index}
                                            item={item}
                                            active={setTitle}
                                            submenu={setSubmenus}
                                            dropdown={!isDual}
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        ))}
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>

                {/* Submenus */}
                <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                    <SidebarHeader className="p-0">
                        <div className="h-16 flex w-full items-center justify-between border-b p-4">
                            <div className="text-base font-medium text-foreground">
                                {title}
                            </div>
                            <SidebarClose />
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
                                {status !== "loading" && isSearching && filteredSubmenus?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No menu found for "{query}"
                                    </div>
                                )}
                                {status !== "loading" && filteredSubmenus.map((item, idx) => (
                                    <SidebarMenuItem key={idx}>
                                        <CollapseSubmenus
                                            item={item}
                                            isSearchActive={isSearching}
                                            level={0}
                                        />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </SidebarContent>

                </Sidebar>
            </Sidebar>
        </>
    )
});

SidebarCollapseMenus.displayName = 'SidebarCollapseMenus';
export default SidebarCollapseMenus;


export function SidebarClose() {
    const { setOpen } = useSidebar();
    return <Button onClick={() => setOpen(false)} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><ChevronsLeftIcon /></Button>
}
