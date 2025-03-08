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
import RenderCollapseDropdownsMenus from "./render-collapse-dropdown";

interface CollapseMenusProps {
    item: menuType,
    active?: (a: string) => void,
    submenu?: (a: submenuType[]) => void,
    dropdown?: boolean
}

export const RenderCollapseMenus = React.memo(({ item, active, submenu, dropdown }: CollapseMenusProps) => {

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

    const renderSidebarMenuButton = (onClick: () => void, asChild: boolean) => (
        <SidebarMenuButton
            tooltip={{ children: item.title, hidden: false }}
            className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
            onClick={onClick}
            asChild={asChild}
        >
            {asChild ? <Link href={item.url}>{renderIcon()}</Link> : renderIcon()}
        </SidebarMenuButton>
    );

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
                        <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.submenu.map((item) => (
                            <DropdownMenuGroup key={item.title}>
                                <RenderCollapseDropdownsMenus item={item} />
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

RenderCollapseMenus.displayName = "RenderCollapseMenus";