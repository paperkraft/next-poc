'use client'

import { Sidebar, SidebarFooter, SidebarHeader, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import SidebarHeaderContent from '@/components/layout/Sidebar/sidebar-header';
import VerticalMenus from '@/components/layout/Sidebar/vertical-sidebar';
import SidebarFooterContent from '@/components/layout/Sidebar/sidebar-footer';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import CollapseMenus from '@/components/layout/Sidebar/collapse-sidebar';
import { themeConfig } from '@/hooks/use-config';
import { NotificationsProvider } from '@/context/notification-context';
import { useMounted } from '@/hooks/use-mounted';

export default function Content({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
    const [config] = themeConfig();
    const { isMobile } = useSidebar();
    const mounted = useMounted();

    if (!mounted) return null

    return (
        <NotificationsProvider>
            {(config.layout === "vertical" || isMobile) &&
                <Sidebar>
                    <SidebarHeader className="h-16 border-b justify-center">
                        <SidebarHeaderContent />
                    </SidebarHeader>

                    <VerticalMenus />
                    {/* <TenantMenus /> */}

                    <SidebarFooter>
                        <SidebarFooterContent />
                    </SidebarFooter>
                </Sidebar>
            }

            {(config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile &&
                <CollapseMenus />
            }

            <SidebarInset>
                <Header />
                <div className={cn("grid grid-rows p-4 gap-4 w-full pb-10", { "container px-8": config.content === 'compact' })}>
                    {children}
                </div>
                <div className="w-full flex justify-center items-center absolute bottom-2">
                    <p className="text-muted-foreground text-sm"><span className="text-xs">Designed by:</span> Sannake.Vishal #SV</p>
                </div>
            </SidebarInset>
        </NotificationsProvider>
    )
}