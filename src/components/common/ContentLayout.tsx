'use client'

import Header from '@/components/layout/Header';
import {
    Sidebar, SidebarFooter, SidebarHeader, SidebarInset, useSidebar
} from '@/components/ui/sidebar';
import { themeConfig } from '@/hooks/use-config';
import { useMount } from '@/hooks/use-mount';
import { GroupedMenus } from '@/lib/menus';
import { cn } from '@/lib/utils';

import AppSidebarMenus from '../sidebar-layout/app-sidebar';
import SidebarCollapseMenus from '../sidebar-layout/app-sidebar-collapsed';
import FooterTag from './FooterTag';
import SidebarHeaderContent from '../sidebar-layout/app-sidebar-header';
import SidebarFooterContent from '../sidebar-layout/app-sidebar-footer';
import HeaderBreadcrumb from '../layout/breadcrum-nav';
import { HeaderTeamSwitcher } from '../sidebar-layout/sidebar-tenant-switcher';

type ContentProps = {
    children: React.ReactNode;
    currentTenant?: { id: number; slug: string; name: string, type: string } | null;
    tenants?: Array<{ id: number; slug: string; name: string, type: string }> | null
    menus?: GroupedMenus[]
}

export default function ContentLayout({ children, currentTenant, menus = [], tenants = [] }: ContentProps) {

    const [config] = themeConfig();
    const { isMobile } = useSidebar();
    const isMounted = useMount();

    const isVertical = config.layout === "vertical";
    const isCollapse = config.layout === "collapsed" || config.layout === "dual-menu";

    if (!isMounted) return null

    return (
        <>
            {(isVertical || isMobile) &&
                <Sidebar>
                    <SidebarHeader className="h-16 border-b justify-center">
                        {tenants && tenants.length > 0 ? (
                            <HeaderTeamSwitcher currentTenant={currentTenant} tenants={tenants} />
                        ) : (
                            <SidebarHeaderContent />
                        )}
                    </SidebarHeader>

                    <AppSidebarMenus menus={menus} />

                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>
            }

            {isCollapse && !isMobile &&
                <SidebarCollapseMenus menus={menus} />
            }

            <SidebarInset>
                <Header menus={menus} currentTenant={currentTenant} tenants={tenants} />
                <div className={cn("grid grid-rows p-4 gap-4 w-full pb-12", { "container px-8": config.content === 'compact' })}>
                    {isCollapse && (<HeaderBreadcrumb menus={menus} />)}
                    {children}
                </div>
                <FooterTag />
            </SidebarInset>
        </>
    )
}