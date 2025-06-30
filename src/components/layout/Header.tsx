'use client'
import { useSession } from 'next-auth/react';
import React from 'react';

import ThemeConfig from '@/components/layout/ThemeCustomizer';
import { Separator } from '@/components/ui/separator';
import { themeConfig } from '@/hooks/use-config';
import { useMounted } from '@/hooks/use-mounted';
import { GroupedMenus } from '@/lib/menus';
import { cn } from '@/lib/utils';

import { useSidebar } from '../ui/sidebar';
import BellNotifications from './bell-notifications';
import LocaleSwitcher from './locale-switcher';
import { CustomTrigger } from './Sidebar/custom-trigger';
import TenantNavbar from './Sidebar/tenant/tenant-navbar';
import UserAction from './UserAction';

const Header = React.memo(({ menus = [] }: { menus: GroupedMenus[] }) => {
    const mounted = useMounted();
    const { data: session } = useSession();
    const { isMobile } = useSidebar();
    const [config] = themeConfig();
    const isHorizontal = config.layout === 'horizontal';

    if (!mounted) return null;

    return (
        <>
            <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b z-50 transition-[width,height] ease-linear">
                <div className={cn(
                    "flex items-center gap-2 w-full",
                    config.content === 'compact' && "container mx-auto border-b-0",
                    config.content === 'wide' && "px-4",
                )}>

                    {(isMobile || config.layout === "vertical") && (
                        <>
                            <CustomTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </>
                    )}

                    {!isMobile && (
                        <span className='font-medium'>{session?.user?.tenantName ?? 'System'}</span>
                    )}

                    <div className='ml-auto flex gap-2'>
                        {!isMobile && (
                            <>
                                <ThemeConfig />
                                <LocaleSwitcher />
                            </>
                        )}
                        <BellNotifications />
                        {isHorizontal && <UserAction />}
                    </div>
                </div>
            </header>

            {!isMobile && isHorizontal && (
                <div className="border-b py-1">
                    <TenantNavbar menus={menus} />
                </div>
            )}
        </>
    );
});

Header.displayName = "Header";
export default Header;