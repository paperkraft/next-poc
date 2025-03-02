'use client'

import React from "react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu } from "../../ui/sidebar";
import { SearchIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";

import DefaultMenu from "./sidebar-default";
import SidebarSkeleton from "./sidebar-skeleton";
import { RenderMobileMenus } from "./sidebar-nested-menus";
import { mapMenu, menuType, submenuType } from "./helper";

const VerticalMenus = React.memo(() => {

    const { data, status } = useSession();
    const [filteredMenus, setFilteredMenus] = React.useState<menuType[][]>();
    const [menus, setMenus] = React.useState<menuType[][]>([]);
    const [query, setQuery] = React.useState<string>('');

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
        setFilteredMenus(finalMenus);

    }, [data]);

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
            setFilteredMenus(menus);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = menus
            .map((menuGroup) =>
                menuGroup.filter(
                    (item) =>
                        item.label.toLowerCase().includes(lowerQuery) ||
                        item.title.toLowerCase().includes(lowerQuery) ||
                        searchSubmenu(item.submenu, lowerQuery)
                )
            )
            .filter((group) => group.length > 0);

        setFilteredMenus(filtered);
    }, [query, menus, searchSubmenu]);

    const isSearching = query.length > 0;

    return (
        <>
            <SidebarGroup className="sticky top-0 z-40 bg-sidebar">
                <SidebarGroupContent className="relative">
                    <SidebarInput
                        id="search"
                        placeholder="Search for menu..."
                        className="px-8 focus-within:!ring-primary"
                        value={query ?? ""}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus={false}
                    />
                    <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                    {
                        query &&
                        <span className="opacity-50 hover:opacity-100 cursor-pointer absolute right-2 top-1/2 size-4 -translate-y-1/2" onClick={() => setQuery('')}>
                            <X className="size-4" />
                        </span>
                    }
                </SidebarGroupContent>
            </SidebarGroup>

            {status === "loading" && <SidebarSkeleton />}

            {status !== "loading" && isSearching && filteredMenus?.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                    No menu found for "{query}"
                </div>
            )}

            {status !== "loading" && !filteredMenus && <DefaultMenu />}

            {status !== "loading" && filteredMenus?.map((group, index) => (
                <SidebarGroup key={index}>
                    <SidebarGroupLabel>{group[0]?.label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.map((item, index) => (
                            <RenderMobileMenus key={index} item={item} isSearchActive={isSearching}/>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    )
});

VerticalMenus.displayName = 'VerticalMenus';
export default VerticalMenus;