'use client';

import React from "react";
import { checkIsActive, menuType, submenuType } from "./helper";
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, DotIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const RenderCollapseSubmenus = React.memo(({ item, isSearchActive, level }: { item: submenuType, isSearchActive: boolean, level: number }) => {

    const { toggleSidebar, isMobile } = useSidebar();
    const path = usePathname();

    const hasSubmenu = Boolean(item.submenu?.length);
    const isActive = React.useMemo(() => checkIsActive(item as menuType, path), [item, path]);
    const shouldExpand = isSearchActive || isActive;

    const handleClick = React.useCallback(() => {
        if (isMobile) toggleSidebar();
    }, [isMobile, toggleSidebar]);

    const [isOpen, setIsOpen] = React.useState(shouldExpand);

    React.useEffect(() => {
        setIsOpen(shouldExpand);
    }, [shouldExpand]);

    const renderSubmenu = () => (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="focus-within:!ring-primary hover:!text-primary hover:bg-muted [&[data-state=open]>svg:not(:first-child)]:rotate-90">
                    <DotIcon />
                    {item.title}
                    <ChevronRight className="ml-auto transition-transform duration-200" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent className="CollapsibleContent" asChild>
                <SidebarMenuSub>
                    {item.submenu?.map((subItem, index) => (
                        <SidebarMenuSubItem key={index}>
                            <RenderCollapseSubmenus item={subItem} isSearchActive={isSearchActive} level={level + 1} />
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )

    return hasSubmenu ? (
        renderSubmenu()
    ) : (
        <SidebarMenuButton
            asChild
            onClick={handleClick}
            className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
        >
            <Link href={item.url}>
                {level == 0 && <DotIcon />}
                {item.title}
            </Link>
        </SidebarMenuButton>

    )
});

RenderCollapseSubmenus.displayName = "RenderCollapseSubmenus";