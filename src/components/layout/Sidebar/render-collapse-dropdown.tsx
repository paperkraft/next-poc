'use client';

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, DotIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { submenuType, menuType, checkIsActive } from "./helper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const RenderDropdownsMenus = ({ item }: { item: submenuType }) => {
    const path = usePathname();
    const hasSubmenu = item?.submenu && item?.submenu?.length > 0;
    const isActive = useMemo(() => checkIsActive(item as menuType, path), [item, path]);

    return hasSubmenu ? (
        <Collapsible defaultOpen={isActive} asChild className="group/collapsible">
            <React.Fragment>
                <CollapsibleTrigger asChild className="[&[data-state=open]>svg:first-child]:rotate-90">
                    <SidebarMenuButton className="[&[data-state=open]>svg:first-child]:rotate-90">
                        <ChevronRight className="transition-transform duration-200" />
                        {item.title}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                    <SidebarMenuSub className="mr-0">
                        {item.submenu?.map((submenu, idx) => (
                            <SidebarMenuSubItem key={submenu.title || idx}>
                                <RenderDropdownsMenus key={submenu.title} item={submenu} />
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </React.Fragment>
        </Collapsible>
    ) : (
        <DropdownMenuItem asChild key={item.title}>
            <SidebarMenuButton asChild className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}>
                <Link href={item.url}>
                    <DotIcon />
                    {item.title}
                </Link>
            </SidebarMenuButton>
        </DropdownMenuItem>
    );
};

export default React.memo(RenderDropdownsMenus);

