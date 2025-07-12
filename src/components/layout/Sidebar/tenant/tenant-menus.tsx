'use client'

import _ from 'lodash';
import { ChevronRight, SearchIcon, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar
} from '@/components/ui/sidebar';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

import DefaultMenu from '../sidebar-default';
import SidebarSkeleton from '../sidebar-skeleton';
import { GroupedMenus, MenuItem } from '@/lib/menus';
import { useMounted } from '@/hooks/use-mounted';

const TenantMenus = React.memo(({ menus = [] }: { menus: GroupedMenus[] }) => {
    const mounted = useMounted();
    const { status } = useSession();
    const [query, setQuery] = React.useState<string>('');
    const debouncedQuery = useDebounce(query, 300);
    const isSearching = query.length > 0;

    const searchModules = React.useCallback((modules: MenuItem[], query: string): boolean => {
        return modules.some(
            item =>
                item.name.toLowerCase().includes(query) ||
                (item.children && searchModules(item.children, query))
        );
    }, []);

    // Filtered menus based on search query
    const filteredMenus = React.useMemo(() => {
        if (!debouncedQuery) return menus;
        const lowerQuery = debouncedQuery.toLowerCase();
        return menus.filter((group) => group.groupName.toLowerCase().includes(lowerQuery) || searchModules(group.modules, lowerQuery))
    }, [debouncedQuery, menus, searchModules]);

    if (!mounted) return null

    return (
        <SidebarContent className="gap-0">
            <SidebarGroup className="sticky top-0 z-40 bg-sidebar">
                <SidebarGroupContent className="relative">
                    <SidebarInput
                        id="search"
                        aria-label="Search menu items"
                        placeholder="Search for menu..."
                        className="px-8 focus-within:!ring-primary"
                        value={query ?? ""}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus={false}
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
                        <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.modules.map((item, index) => (
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

TenantMenus.displayName = 'TenantMenus';
export default TenantMenus;

export const RenderMenus = React.memo(({ item, isSearchActive }: { item: MenuItem, isSearchActive: boolean }) => {

    const { toggleSidebar, isMobile } = useSidebar();
    const path = usePathname();
    const mounted = useMounted();
    const hasSubmenu = item?.children?.length > 0;
    const isActive = useMemo(() => checkIsActive(item, path), [item, path]);
    const shouldExpand = isSearchActive ? true : isActive;

    const LucideIcon = Icons[item.icon as keyof typeof Icons] as React.ElementType ?? Icons.DotIcon;

    if (!mounted) return null

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton tooltip={item.name} asChild onClick={() => isMobile && toggleSidebar()} className="focus-within:!ring-primary">
                <Link href={item.path as string} className={cn("hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}>
                    <LucideIcon />
                    {item.name}
                </Link>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={shouldExpand} className="group/collapsible [&[data-state=open]>button>svg:not(:first-child)]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.name} className="focus-within:!ring-primary">
                        <LucideIcon />
                        <span>{item.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item?.children.map((subItem, index) => (
                            <RenderMenus key={index} item={subItem} isSearchActive={isSearchActive} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
});

RenderMenus.displayName = "RenderMenus";

function checkIsActive(item: MenuItem, pathname: string): boolean {
    const isSubmenuActive = (submenu: MenuItem[]): boolean => {
        return submenu.some(sub =>
            sub?.path === pathname ||
            pathname.startsWith(sub?.path as string) ||
            (sub.children ? isSubmenuActive(sub.children) : false)
        );
    };

    return (
        item?.path === pathname ||
        pathname.startsWith(item?.path as string) ||
        isSubmenuActive(item.children)
    );
}