'use client'

import React from "react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu } from "../../ui/sidebar";
import { SearchIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";

import DefaultMenu from "./sidebar-default";
import SidebarSkeleton from "./sidebar-skeleton";
import NestedMenu from "./sidebar-nested-menus";
import { mapMenu, menuType, submenuType } from "./helper";

const RenderMenus = React.memo(() => {

    const { data, status } = useSession();
    const [filter, setFilter] = React.useState<menuType[][]>();
    const [menus, setMenus] = React.useState<menuType[][]>([]);
    const [query, setQuery] = React.useState<string>('');

    React.useEffect(() => {
        if (data) {
            const userModules = data?.user?.modules;
            const formatedMenus = userModules && mapMenu(userModules);
            const uniqueLabels = formatedMenus && Array.from(new Set(formatedMenus.map((menu: any) => menu.label)));
            const finalMenus = uniqueLabels && uniqueLabels.map((label: any) => formatedMenus.filter((menu: any) => menu.label === label));

            if (finalMenus) {
                setFilter(finalMenus);
                setMenus(finalMenus);
            }
        }
    }, [data]);

    const searchSubmenu = React.useCallback((submenu: submenuType[], query: string): boolean => {
        return submenu?.some(item =>
            item.title.toLowerCase().includes(query) ||
            (item.submenu && searchSubmenu(item.submenu, query))
        ) || false;
    }, []);

    const filterMenu = React.useCallback((query: string) => {
        const lowerCaseQuery = query.toLowerCase();

        const filtered = menus?.map(menuItem =>
            menuItem.filter(item =>
                item.label.toLowerCase().includes(lowerCaseQuery) ||
                item.title.toLowerCase().includes(lowerCaseQuery) ||
                searchSubmenu(item.submenu, lowerCaseQuery)
            )
        ).filter(menuItem => menuItem.length > 0);

        setFilter(filtered || []);
    }, [menus, searchSubmenu]);

    React.useEffect(() => {
        if (query) {
            filterMenu(query);
        } else {
            setFilter(menus);
        }
    }, [query, menus, filterMenu]);

    return (
        <>
            <SidebarGroup className="sticky top-0 z-40 bg-sidebar">
                <SidebarGroupContent className="relative">
                    <SidebarInput
                        id="search"
                        placeholder="Search for menu..."
                        className="px-8"
                        value={query ?? ""}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                    {
                        query &&
                        <span className="cursor-pointer absolute right-2 top-1/2 size-4 -translate-y-1/2" onClick={() => setQuery('')}>
                            <X className="size-4" />
                        </span>
                    }
                </SidebarGroupContent>
            </SidebarGroup>

            {status === "loading" && <SidebarSkeleton />}

            {status !== "loading" && !filter && <DefaultMenu />}

            {status !== "loading" && filter?.map((data, index) => (
                <SidebarGroup key={index}>
                    <SidebarGroupLabel>{data.at(0)?.label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.map((item, index) => (
                            <NestedMenu key={index} item={item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    )
});

RenderMenus.displayName = 'RenderMenus';
export default RenderMenus;