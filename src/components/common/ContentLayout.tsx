'use client'

import Header from '@/components/layout/Header';
import {
    Sidebar, SidebarFooter, SidebarHeader, SidebarInset, useSidebar
} from '@/components/ui/sidebar';
import { themeConfig } from '@/hooks/use-config';
import { useMount } from '@/hooks/use-mount';
import { cn } from '@/lib/utils';

import AppSidebarMenus from '../sidebar-layout/app-sidebar';
import SidebarCollapseMenus from '../sidebar-layout/app-sidebar-collapsed';
import FooterTag from './FooterTag';
import SidebarHeaderContent from '../sidebar-layout/app-sidebar-header';
import SidebarFooterContent from '../sidebar-layout/app-sidebar-footer';
import HeaderBreadcrumb from '../layout/breadcrum-nav';
import { HeaderTeamSwitcher } from '../sidebar-layout/sidebar-tenant-switcher';
import { useTenant } from '@/context/TenantProvider';
import { ReactNode } from 'react';

export default function ContentLayout({ children }: { children: ReactNode }) {

    const [config] = themeConfig();
    const { tenants } = useTenant();
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
                            <HeaderTeamSwitcher />
                        ) : (
                            <SidebarHeaderContent />
                        )}
                    </SidebarHeader>

                    <AppSidebarMenus />

                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>
            }

            {isCollapse && !isMobile &&
                <SidebarCollapseMenus />
            }

            <SidebarInset>
                <Header />
                <div className={cn("grid grid-rows p-4 gap-4 w-full pb-12", { "container px-8": config.content === 'compact' })}>
                    {isCollapse && (<HeaderBreadcrumb />)}
                    {children}
                </div>
                <FooterTag />
            </SidebarInset>
        </>
    )
}