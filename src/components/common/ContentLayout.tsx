'use client'

import Header from '@/components/layout/Header';
import {
    Sidebar, SidebarFooter, SidebarHeader, SidebarInset, useSidebar
} from '@/components/ui/sidebar';
import { themeConfig } from '@/hooks/use-config';
import { useMounted } from '@/hooks/use-mounted';
import { GroupedMenus } from '@/lib/menus';
import { cn } from '@/lib/utils';

import AppSidebarMenus from '../sidebar-layout/app-sidebar';
import SidebarCollapseMenus from '../sidebar-layout/app-sidebar-collapsed';
import FooterTag from './FooterTag';
import SidebarHeaderContent from '../sidebar-layout/app-sidebar-header';
import SidebarFooterContent from '../sidebar-layout/app-sidebar-footer';
import HeaderBreadcrumb from '../layout/breadcrum-nav';

type ContentProps = {
    children: React.ReactNode;
    currentTenant?: { id: number; slug: string; name: string, type: string } | null;
    tenants?: Array<{ id: number; slug: string; name: string, type: string }> | null
    menus?: GroupedMenus[]
}

export default function ContentLayout({ children, currentTenant, menus = [], tenants = [] }: ContentProps) {

    const [config] = themeConfig();
    const { isMobile } = useSidebar();
    const mounted = useMounted();

    if (!mounted) return null

    return (
        <>
            {(config.layout === "vertical" || isMobile) &&
                <Sidebar>
                    <SidebarHeader className="h-16 border-b justify-center">
                        <SidebarHeaderContent />
                    </SidebarHeader>

                    <AppSidebarMenus menus={menus} />

                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>
            }

            {(config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile &&
                <SidebarCollapseMenus menus={menus} />
            }

            <SidebarInset>
                <Header menus={menus} currentTenant={currentTenant} tenants={tenants} />
                <div className={cn("grid grid-rows p-4 gap-4 w-full pb-12", { "container px-8": config.content === 'compact' })}>
                    {config.layout !== "horizontal" && (
                        <HeaderBreadcrumb menus={menus} />
                    )}
                    {children}
                </div>
                <FooterTag />
            </SidebarInset>
        </>
    )
}