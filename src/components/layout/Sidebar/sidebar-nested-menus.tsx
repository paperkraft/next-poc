'use cleint'
import React, { useMemo } from "react";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from "../../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { ChevronRight, DotIcon } from "lucide-react";
import { menuType, submenuType } from "./helper";

const NestedMenu = React.memo(({ item, isSearchActive }: { item: menuType, isSearchActive: boolean }) => {

    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const isActive = useMemo(() => checkIsActive(item, path), [item, path]);
    const shouldExpand = isSearchActive ? true : isActive;

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton tooltip={item.title} asChild onClick={() => isMobile && toggleSidebar()} className="focus-within:!ring-primary">
                <Link href={item.url} className={cn("hover:!text-primary hover:bg-muted", { "bg-muted text-primary": item.url === path })}>
                    {item.icon ? <item.icon /> : <DotIcon />}
                    {item.title}
                </Link>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={shouldExpand} className="group/collapsible [&[data-state=open]>button>svg:not(:first-child)]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className="focus-within:!ring-primary">
                        {item.icon ? <item.icon /> : <DotIcon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {
                            item?.submenu.map((subItem, index) => (
                                <NestedMenu key={index} item={subItem as menuType} isSearchActive={isSearchActive}/>
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


function checkIsActive(item: menuType, pathname: string): boolean {
    const isSubmenuActive = (submenu: submenuType[]): boolean => {
        return submenu.some(sub =>
            sub.url === pathname ||
            pathname.startsWith(sub.url) ||
            (sub.submenu ? isSubmenuActive(sub.submenu) : false)
        );
    };

    return (
        item.url === pathname ||
        pathname.startsWith(item.url) ||
        isSubmenuActive(item.submenu)
    );
}