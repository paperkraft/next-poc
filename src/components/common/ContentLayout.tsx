'use client'

import Header from '@/components/layout/Header';
import CollapseMenus from '@/components/layout/Sidebar/collapse-sidebar';
import SidebarFooterContent from '@/components/layout/Sidebar/sidebar-footer';
import SidebarHeaderContent from '@/components/layout/Sidebar/sidebar-header';
import {
    Sidebar, SidebarFooter, SidebarHeader, SidebarInset, useSidebar
} from '@/components/ui/sidebar';
import { themeConfig } from '@/hooks/use-config';
import { useMounted } from '@/hooks/use-mounted';
import { GroupedMenus } from '@/lib/menus';
import { cn } from '@/lib/utils';

import TenantMenus from '../layout/Sidebar/tenant/tenant-menus';
import FooterTag from './FooterTag';
import { Tenant } from '@prisma/client';

type ContentProps = {
    children: React.ReactNode;
    tenant?: Tenant | null;
    menus?: GroupedMenus[]
}

export default function ContentLayout({ children, tenant, menus = [] }: ContentProps) {

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

                    <TenantMenus menus={menus} />

                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>
            }

            {(config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile &&
                <CollapseMenus />
            }

            <SidebarInset>
                <Header menus={menus} />
                <div className={cn("grid grid-rows p-4 gap-4 w-full pb-12", { "container px-8": config.content === 'compact' })}>
                    {children}
                </div>
                <FooterTag />
            </SidebarInset>
        </>
    )
}