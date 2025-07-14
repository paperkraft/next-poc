'use client';

import React, { useMemo } from "react";
import * as Icons from 'lucide-react';
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { useMount } from '@/hooks/use-mount';
import { ThemeWrapper } from "@/components/layout/theme-wrapper";
import { MenuItem } from "@/lib/menus";
import { CollapseDropdownsMenus } from "./collapse-dropdown";
import { checkIsActive } from "../helper";

interface CollapseMenusProps {
    item: MenuItem,
    active?: (a: string) => void,
    submenu?: (a: MenuItem[]) => void,
    dropdown?: boolean
}

export const CollapseMenus = React.memo(({ item, active, submenu, dropdown }: CollapseMenusProps) => {

    const { toggleSidebar, setOpen, isMobile } = useSidebar();
    const path = usePathname();
    const hasSubmenu = item?.children?.length > 0;
    const isActive = useMemo(() => checkIsActive(item, path), [item, path]);

    const isMounted = useMount()

    const handleClick = () => {
        if (isMobile) toggleSidebar();
        setOpen(false);
    };

    const handleSubmenuClick = () => {
        setOpen(true);
        active?.(item.name);
        submenu?.(item.children);
    };

    const LucideIcon = Icons[item.icon as keyof typeof Icons] as React.ElementType ?? Icons.DotIcon;

    const renderSidebarMenuButton = (onClick: () => void, asChild: boolean) => (
        <SidebarMenuButton
            tooltip={{ children: item.name, hidden: false }}
            className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
            onClick={onClick}
            asChild={asChild}
        >
            {asChild ?
                (<Link href={item.path ?? "#"}>
                    <LucideIcon />
                </Link>)
                : (<LucideIcon />)
            }
        </SidebarMenuButton>
    );


    if (!isMounted) return null

    if (!hasSubmenu) {
        return (
            renderSidebarMenuButton(handleClick, true)
        )
    } else {
        return dropdown ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {renderSidebarMenuButton(handleSubmenuClick, false)}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg"
                >
                    <ThemeWrapper>
                        <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.children.map((item) => (
                            <DropdownMenuGroup key={item.id}>
                                <CollapseDropdownsMenus item={item} />
                            </DropdownMenuGroup>
                        ))}
                    </ThemeWrapper>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            renderSidebarMenuButton(handleSubmenuClick, false)
        )
    }
});

CollapseMenus.displayName = "CollapseMenus";