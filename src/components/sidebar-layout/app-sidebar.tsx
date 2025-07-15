'use client'

import { SearchIcon, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu
} from '@/components/ui/sidebar';
import { useDebounce } from '@/hooks/use-debounce';
import { useMount } from '@/hooks/use-mount';
import { GroupedMenus, MenuItem } from '@/lib/menus';

import { RenderMenus } from './render-menus';
import DefaultMenu from './sidebar-default';
import SidebarSkeleton from './sidebar-skeleton';
import { useTenant } from '@/context/TenantProvider';

const AppSidebarMenus = React.memo(() => {
    const isMounted = useMount();
    const { menus } = useTenant();
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

    if (!isMounted) return null

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

AppSidebarMenus.displayName = 'AppSidebarMenus';
export default AppSidebarMenus;