"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { mapMenu, menuType } from "./Sidebar/helper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ThemeWrapper } from "./theme-wrapper"

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

                    <DropdownMenuContent align="start">
                        <ThemeWrapper>
                            {item.map((component, idx) => (
                                <NestedMenu key={idx} item={component as menuType} />
                            ))}
                        </ThemeWrapper>
                    </DropdownMenuContent>
                </DropdownMenu>
            ))}
        </>
    );
}

const NestedMenu = React.memo(({ item }: { item: menuType }) => {
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;

    if (!hasSubmenu) {
        return (
            <DropdownMenuItem asChild>
                <Link href={item.url} className={cn("w-full hover:!text-primary hover:bg-muted", { "bg-muted !text-primary": item.url === path })}>{item.title}</Link>
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
                    <ThemeWrapper>
                        {item?.submenu.map((ele, idx) => (
                            <NestedMenu key={idx} item={ele as menuType} />
                        ))}
                    </ThemeWrapper>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
})

NestedMenu.displayName = "NestedMenu"