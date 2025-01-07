'use client'

import React from "react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu } from "../../ui/sidebar";
import { menuType, submenuType, transformMenuData } from "../data";
import { SearchIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { IGroup } from "@/app/_Interface/Group";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import DefaultMenu from "./sidebar-default";
import SidebarSkeleton from "./sidebar-skeleton";
import NestedMenu from "./sidebar-nested-menus";

const RenderMenus = React.memo(() => {

    const { data } = useSession();
    const [filter, setFilter] = React.useState<menuType[][]>();
    const [menus, setMenus] = React.useState<menuType[][]>([]);
    const [query, setQuery] = React.useState<string>('');

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

    const { data: groups, isLoading } = useQuery({ queryKey: ["group"], queryFn: fetchGroups });

    React.useEffect(() => {
        if (groups && data) {
            const userPermissions = data?.user.permissions;
            const userModules = data?.user.modules;

            const filteredMenuData = transformMenuData(userModules, userPermissions);

            const mm = mapMenu(userModules);
            const uniqueLabels = Array.from(new Set(mm.map((menu) => menu.label)));
            const fm = uniqueLabels.map((label) => mm.filter((menu) => menu.label === label));

            console.log('uniqueLabels', uniqueLabels);
            console.log('mapMenu', fm);
            
            const userMenus = groups?.map((item) => filteredMenuData
            .filter((menu) => menu.label?.toLowerCase() === item.name?.toLowerCase()))
            .filter((menuGroup) => menuGroup?.length > 0);
            
            
            
            // console.log('userMenus', userMenus);

            if (userMenus) {
                setFilter(userMenus);
                setMenus(userMenus);
            }
        }
    }, [groups, data]);

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

            {isLoading && <SidebarSkeleton />}

            {!isLoading && !filter && <DefaultMenu />}

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
});

RenderMenus.displayName = 'RenderMenus';
export default RenderMenus;

// helper functions
type inputType = {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    group: string;
    path: string;
    subModules: inputType[];
};

const generateSubMenu = (subModule: inputType): submenuType => ({
    title: subModule.name,
    url: subModule.path ? subModule.path : '#',
    submenu: subModule.subModules.map(generateSubMenu)
});

const mapMenu = (inputData: inputType[]): menuType[] => {
    const groupedData = inputData.reduce((acc, item) => {
        if (!acc[item.group]) {
            acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
    }, {} as { [key: string]: inputType[] });

    return Object.keys(groupedData).map((groupLabel) => {
        const groupItems = groupedData[groupLabel];

        return groupItems.map((item) => ({
            label: item.group,
            title: item.name,
            url: item.path ? item.path : '#',
            icon: () => <></>,
            isActive: false,
            submenu: item.subModules.map(generateSubMenu),
        }));
    }).flat();
};
