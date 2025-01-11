'use cleint'
import React from "react";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from "../../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { ChevronRight, DotIcon } from "lucide-react";
import { menuType } from "./helper";

const NestedMenu = React.memo(({ item }: { item: menuType }) => {

    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const active = item.url === path
        || item?.submenu?.some(subItem => subItem.url === path)
        || item?.submenu?.some(subItem => subItem?.submenu?.some(subSubItem => subSubItem.url === path))

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton tooltip={item.title} asChild onClick={() => isMobile && toggleSidebar()} >
                <Link href={item.url} className={cn({ "bg-sidebar-accent text-sidebar-accent-foreground": item.url === path })}>
                    {item.icon ? <item.icon /> : <DotIcon/>}
                    {item.title}
                </Link>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={active} className="group/collapsible [&[data-state=open]>button>svg:not(:first-child)]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon ? <item.icon /> : <DotIcon/>}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {
                            item?.submenu.map((subItem, index) => (
                                <NestedMenu key={index} item={subItem as menuType} />
                            ))
                        }
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
});

NestedMenu.displayName = "NestedMenu";

export default NestedMenu;