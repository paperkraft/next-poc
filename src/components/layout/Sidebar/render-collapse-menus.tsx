'use client';

import React, { useMemo } from "react";
import { SidebarMenuButton, useSidebar } from "../../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DotIcon } from "lucide-react";
import { checkIsActive, menuType, submenuType } from "./helper";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ThemeWrapper } from "../theme-wrapper";
import RenderDropdownsMenus from "./render-collapse-dropdown";

interface CollapseMenusProps {
    item: menuType,
    active?: (a: string) => void,
    submenu?: (a: submenuType[]) => void,
    dropdown?: boolean
    isSearchActive: boolean
}

export const RenderCollapseIconMenus = React.memo(({ item, active, submenu, dropdown, isSearchActive }: CollapseMenusProps) => {

    const { toggleSidebar, setOpen, isMobile } = useSidebar();
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const isActive = useMemo(() => checkIsActive(item, path), [item, path]);

    const handleClick = () => {
        if (isMobile) toggleSidebar();
        setOpen(false);
    };

    const handleSubmenuClick = () => {
        setOpen(true);
        active?.(item.title);
        submenu?.(item.submenu);
    };

    const renderIcon = () => (item.icon ? <item.icon /> : <DotIcon />);

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton
                asChild
                tooltip={{ children: item.title, hidden: false }}
                className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
                onClick={handleClick}
            >
                <Link href={item.url}>{renderIcon()}</Link>
            </SidebarMenuButton>
        )
    } else {
        return dropdown ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title, hidden: false }}
                        className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
                        onClick={handleSubmenuClick}
                    >
                        {renderIcon()}
                    </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg"
                >
                    <ThemeWrapper>
                        <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.submenu.map((item) => (
                            <DropdownMenuGroup key={item.title}>
                                <RenderDropdownsMenus item={item} isSearchActive={isSearchActive} />
                            </DropdownMenuGroup>
                        ))}
                    </ThemeWrapper>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <SidebarMenuButton
                tooltip={{ children: item.title, hidden: false }}
                className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
                onClick={handleSubmenuClick}
            >
                {renderIcon()}
            </SidebarMenuButton>
        )
    }
});

RenderCollapseIconMenus.displayName = "RenderCollapseIconMenus";