'use client';

import React from "react";
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, DotIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { MenuItem } from "@/lib/menus";
import { checkIsActive } from "../helper";

export const CollapseSubmenus = React.memo(({ item, isSearchActive, level }: { item: MenuItem, isSearchActive: boolean, level: number }) => {

    const { toggleSidebar, isMobile } = useSidebar();
    const path = usePathname();

    const mounted = useMounted()

    const hasSubmenu = Boolean(item.children?.length);
    const isActive = React.useMemo(() => checkIsActive(item as MenuItem, path), [item, path]);
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
                    {item.name}
                    <ChevronRight className="ml-auto transition-transform duration-200" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent className="CollapsibleContent" asChild>
                <SidebarMenuSub>
                    {item.children?.map((subItem, index) => (
                        <SidebarMenuSubItem key={index}>
                            <CollapseSubmenus item={subItem} isSearchActive={isSearchActive} level={level + 1} />
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )

    if (!mounted) return null

    return hasSubmenu ? (
        renderSubmenu()
    ) : (
        <SidebarMenuButton
            asChild
            onClick={handleClick}
            className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
        >
            <Link href={item.path ?? "#"}>
                {level == 0 && <DotIcon />}
                {item.name}
            </Link>
        </SidebarMenuButton>

    )
});

CollapseSubmenus.displayName = "CollapseSubmenus";