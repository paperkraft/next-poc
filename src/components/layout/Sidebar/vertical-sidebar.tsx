'use client'

import React, { useMemo } from "react";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight, DotIcon, SearchIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";

import DefaultMenu from "./sidebar-default";
import SidebarSkeleton from "./sidebar-skeleton";
import { checkIsActive, mapMenu, menuType, submenuType } from "./helper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import _ from "lodash";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


const VerticalMenus = React.memo(() => {

    const { data, status } = useSession();
    const [query, setQuery] = React.useState<string>('');
    const debouncedQuery = useDebounce(query, 300);
    const isSearching = query.length > 0;

    // Helper function for recursive submenu search
    const searchSubmenu = React.useCallback((submenu: submenuType[], query: string): boolean => {
        return submenu.some(
            item =>
                item.title.toLowerCase().includes(query) ||
                (item.submenu && searchSubmenu(item.submenu, query))
        );
    }, []);

    // Memoize menu mapping
    const formattedMenus = React.useMemo(() => {
        if (!data?.user?.modules) return [];
        return mapMenu(data.user.modules);
    }, [data?.user?.modules]);

    // Memoize grouped menus
    const groupedMenus = React.useMemo(() => Object.values(_.groupBy(formattedMenus, "label")), [formattedMenus]);

    // Filtered menus based on search query
    const filteredMenus = React.useMemo(() => {
        if (!debouncedQuery) return groupedMenus;

        const lowerQuery = debouncedQuery.toLowerCase();
        return groupedMenus
            .map(group =>
                group.filter(
                    item =>
                        item.label.toLowerCase().includes(lowerQuery) ||
                        item.title.toLowerCase().includes(lowerQuery) ||
                        searchSubmenu(item.submenu, lowerQuery)
                )
            )
            .filter(group => group.length > 0);
    }, [debouncedQuery, groupedMenus, searchSubmenu]);

    return (
        <SidebarContent className="gap-0">
            <SidebarGroup className="sticky top-0 z-40 bg-sidebar">
                <SidebarGroupContent className="relative">
                    <SidebarInput
                        id="search"
                        placeholder="Search for menu..."
                        className="px-8 focus-within:!ring-primary"
                        value={query ?? ""}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus={false}
                        aria-label="Search menu items"
                    />

                    <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />

                    {query.length > 0 && (
                        <span className="opacity-50 hover:opacity-100 cursor-pointer absolute right-2 top-1/2 size-4 -translate-y-1/2" onClick={() => setQuery('')}>
                            <X className="size-4" />
                        </span>
                    )}
                </SidebarGroupContent>
            </SidebarGroup>

            <ScrollArea className="h-[100vh]">
                {status === "loading" && <SidebarSkeleton />}

                {status !== "loading" && isSearching && filteredMenus?.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No menu found for "{debouncedQuery}"
                    </div>
                )}

                {status !== "loading" && !filteredMenus && <DefaultMenu />}

                {status !== "loading" && filteredMenus?.map((group, index) => (
                    <SidebarGroup key={index}>
                        <SidebarGroupLabel>{group[0]?.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.map((item, index) => (
                                <RenderMenus key={index} item={item} isSearchActive={isSearching} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </SidebarContent>
    )
});

VerticalMenus.displayName = 'VerticalMenus';
export default VerticalMenus;

export const RenderMenus = React.memo(({ item, isSearchActive }: { item: menuType, isSearchActive: boolean }) => {

    const { toggleSidebar, isMobile } = useSidebar();
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const isActive = useMemo(() => checkIsActive(item, path), [item, path]);
    const shouldExpand = isSearchActive ? true : isActive;

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton tooltip={item.title} asChild onClick={() => isMobile && toggleSidebar()} className="focus-within:!ring-primary">
                <Link href={item.url} className={cn("hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}>
                    {item.icon ? <item.icon /> : <DotIcon />}
                    {item.title}
                </Link>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={shouldExpand} className="group/collapsible [&[data-state=open]>button>svg:not(:first-child)]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className="focus-within:!ring-primary">
                        {item.icon ? <item.icon /> : <DotIcon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item?.submenu.map((subItem, index) => (
                            <RenderMenus key={index} item={subItem as menuType} isSearchActive={isSearchActive} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
});

RenderMenus.displayName = "RenderMenus";