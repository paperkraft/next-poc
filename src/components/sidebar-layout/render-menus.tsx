'use client'

import * as Icons from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from '@/components/ui/sidebar';
import { useMount } from '@/hooks/use-mount';
import { MenuItem } from '@/lib/menus';
import { cn } from '@/lib/utils';

import { checkIsActive } from './helper';

export const RenderMenus = React.memo(({ item, isSearchActive }: { item: MenuItem, isSearchActive: boolean }) => {

    const { toggleSidebar, isMobile } = useSidebar();
    const path = usePathname();
    const isMount = useMount();
    const hasSubmenu = item?.children?.length > 0;
    const isActive = React.useMemo(() => checkIsActive(item, path), [item, path]);
    const shouldExpand = isSearchActive ? true : isActive;

    const LucideIcon = Icons[item.icon as keyof typeof Icons] as React.ElementType ?? Icons.DotIcon;

    if (!isMount) return null

    if (!hasSubmenu) {
        return (
            <SidebarMenuButton
                asChild
                tooltip={item.name}
                className="focus-within:!ring-primary"
                onClick={() => isMobile && toggleSidebar()}
            >
                <Link
                    href={item.path as string}
                    className={cn(
                        "hover:!text-primary hover:bg-muted",
                        { "bg-muted text-primary": isActive }
                    )}
                >
                    <LucideIcon />
                    {item.name}
                </Link>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                defaultOpen={shouldExpand}
                className="group/collapsible [&[data-state=open]>button>svg:not(:first-child)]:rotate-90"
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.name}
                        className={cn(
                            "focus-within:!ring-primary",
                            { "bg-muted text-primary hover:!text-primary hover:bg-muted": isActive }
                        )}
                    >
                        <LucideIcon />
                        <span>{item.name}</span>
                        <Icons.ChevronRight className="ml-auto transition-transform duration-200" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item?.children.map((subItem, index) => (
                            <RenderMenus
                                key={index}
                                item={subItem}
                                isSearchActive={isSearchActive}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
});

RenderMenus.displayName = "RenderMenus";