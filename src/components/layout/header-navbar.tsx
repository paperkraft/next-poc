"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { mapMenu, menuType } from "./Sidebar/helper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import Link from "next/link"

export default function HeaderNavigationMenu() {
    const { data } = useSession();
    const [menus, setMenus] = React.useState<menuType[][]>([]);

    React.useEffect(() => {
        if (data) {
            const userModules = data?.user?.modules;
            const formatedMenus = userModules && mapMenu(userModules);
            const uniqueLabels = formatedMenus && Array.from(new Set(formatedMenus.map((menu: any) => menu.label)));
            const finalMenus = uniqueLabels && uniqueLabels.map((label: any) => formatedMenus.filter((menu: any) => menu.label === label));

            if (finalMenus) {
                setMenus(finalMenus);
            }
        }
    }, [data]);

    return (
        <>
            {menus?.map((item, idx) => (
                <DropdownMenu key={idx}>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} autoFocus={false}>{item.at(0)?.label}</Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        {item.map((component, idx) => (
                            <NestedMenu key={idx} item={component as menuType} />
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ))}
        </>
    );
}

const NestedMenu = ({ item }: { item: menuType }) => {
    const hasSubmenu = item?.submenu?.length > 0;

    if (!hasSubmenu) {
        return (
            <DropdownMenuItem asChild>
                <Link href={item.url} className="w-full">{item.title}</Link>
            </DropdownMenuItem>
        )
    }

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {item.title}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {item?.submenu.map((ele, idx) => (
                        <NestedMenu key={idx} item={ele as menuType} />
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
}