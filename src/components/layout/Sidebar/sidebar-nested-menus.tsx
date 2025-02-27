'use cleint'
import React, { useMemo } from "react";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, useSidebar } from "../../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { ChevronRight, DotIcon } from "lucide-react";
import { menuType, submenuType } from "./helper";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ThemeWrapper } from "../theme-wrapper";


const RenderNested = ({ item }: { item: submenuType }) => {
    const hasSubmenu = item?.submenu && item?.submenu?.length > 0;
    const path = usePathname();
    const isActive = useMemo(() => checkIsActive(item as menuType, path), [item, path]);
    if (hasSubmenu) {
        return (
            <>
                <Collapsible defaultOpen={isActive} asChild className="group/collapsible">
                    <React.Fragment>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="[&[data-state=open]>svg:first-child]:rotate-90">
                                <ChevronRight className="transition-transform duration-200" />
                                {item.title}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                            <SidebarMenuSub className="mr-0">
                                {item.submenu?.map((submenu, idx) => (
                                    <SidebarMenuSubItem key={idx}>
                                        <RenderNested key={submenu.title} item={submenu} />
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </React.Fragment>
                </Collapsible>
            </>
        )
    } else {
        return (
            <DropdownMenuItem asChild key={item.title}>
                <SidebarMenuButton asChild className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}>
                    <Link href={item.url}>
                        <DotIcon />
                        {item.title}
                    </Link>
                </SidebarMenuButton>
            </DropdownMenuItem>
        )
    }
}

const NestedMenu = React.memo(({ item, active, submenu, dropdown }: { item: menuType, active?: (a: string) => void, submenu?: (a: submenuType[]) => void, dropdown?: boolean }) => {

    const { toggleSidebar, setOpen } = useSidebar();
    const isMobile = useIsMobile();
    const path = usePathname();
    const hasSubmenu = item?.submenu?.length > 0;
    const isActive = useMemo(() => checkIsActive(item, path), [item, path]);

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton
                asChild
                tooltip={{ children: item.title, hidden: false }}
                className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
                onClick={() => { isMobile && toggleSidebar(); setOpen(false); }}
            >
                <Link href={item.url}>
                    {item.icon ? <item.icon /> : <DotIcon />}
                </Link>
            </SidebarMenuButton>
        )
    } else {
        return (
            <>
                {dropdown ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                tooltip={{ children: item.title, hidden: false }}
                                className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
                                onClick={() => {
                                    // setOpen(true);
                                    active && active(item.title);
                                    submenu && submenu(item.submenu)
                                }}
                            >
                                {item.icon ? <item.icon /> : <DotIcon />}
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
                                        <RenderNested item={item} />
                                    </DropdownMenuGroup>
                                ))}
                            </ThemeWrapper>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <SidebarMenuButton
                        tooltip={{ children: item.title, hidden: false }}
                        className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
                        onClick={() => {
                            setOpen(true);
                            active && active(item.title);
                            submenu && submenu(item.submenu)
                        }}
                    >
                        {item.icon ? <item.icon /> : <DotIcon />}
                    </SidebarMenuButton>
                )
                }
            </>
        )
    }
});

NestedMenu.displayName = "NestedMenu";

export default NestedMenu;

export const NestedSubMenu = React.memo(({ item, isSearchActive, level }: { item: submenuType, isSearchActive: boolean, level: number }) => {

    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();
    const path = usePathname();
    const hasSubmenu = item?.submenu && item?.submenu?.length > 0;

    const isActive = useMemo(() => checkIsActive(item as menuType, path), [item, path]);
    const shouldExpand = isSearchActive ? true : isActive;

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton
                asChild
                onClick={() => { isMobile && toggleSidebar(); }}
                className={cn("focus-within:!ring-primary hover:!text-primary hover:bg-muted", { "bg-muted text-primary": isActive })}
            >
                <Link href={item.url}>
                    {level == 0 && <DotIcon />}
                    {item.title}
                </Link>
            </SidebarMenuButton>
        )
    } else {
        return (
            <Collapsible defaultOpen={shouldExpand} className="group/collapsible" asChild>
                <React.Fragment>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="focus-within:!ring-primary hover:!text-primary hover:bg-muted [&[data-state=open]>svg:not(:first-child)]:rotate-90">
                            <DotIcon />
                            <>{item.title}</>
                            <ChevronRight className="ml-auto transition-transform duration-200" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className='CollapsibleContent' asChild>
                        <SidebarMenuSub>
                            {
                                item?.submenu?.map((subItem, index) => (
                                    <SidebarMenuSubItem key={index} >
                                        <NestedSubMenu item={subItem} isSearchActive={isSearchActive} level={index + 1} />
                                    </SidebarMenuSubItem>
                                ))
                            }
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </React.Fragment>
            </Collapsible>
        )
    }
});

NestedSubMenu.displayName = "NestedSubMenu";

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


export const RenderMobileMenus = React.memo(({ item, isSearchActive }: { item: menuType, isSearchActive: boolean }) => {

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
                                <RenderMobileMenus key={index} item={subItem as menuType} isSearchActive={isSearchActive} />
                            ))
                        }
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
});

NestedMenu.displayName = "NestedMenu";