'use client';

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, DotIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { checkIsActive } from "./helper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { MenuItem } from "@/lib/menus";

export const RenderCollapseDropdownsMenus = React.memo(({ item }: { item: MenuItem }) => {
    const path = usePathname();
    const hasSubmenu = item?.children && item?.children?.length > 0;
    const isActive = useMemo(() => checkIsActive(item as MenuItem, path), [item, path]);
    const mounted = useMounted()

    if (!mounted) return null

    return hasSubmenu ? (
        <Collapsible defaultOpen={isActive} asChild className="group/collapsible">
            <>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="[&[data-state=open]>svg:first-child]:rotate-90">
                        <ChevronRight className="transition-transform duration-200" />
                        {item.name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                    <SidebarMenuSub className="mr-0">
                        {item.children?.map((child, idx) => (
                            <SidebarMenuSubItem key={child.id || idx}>
                                <RenderCollapseDropdownsMenus key={child.id} item={child} />
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </>
        </Collapsible>
    ) : (
        <DropdownMenuItem asChild key={item.id}>
            <SidebarMenuButton asChild className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}>
                <Link href={item.path ?? "#"}>
                    <DotIcon />
                    {item.name}
                </Link>
            </SidebarMenuButton>
        </DropdownMenuItem>
    );
});