'use client'

import React from 'react';

import ThemeConfig from '@/components/layout/ThemeCustomizer';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { useTenant } from '@/context/TenantProvider';
import { themeConfig } from '@/hooks/use-config';
import { useMount } from '@/hooks/use-mount';
import { cn } from '@/lib/utils';

import { TenantSwitcher } from '../common/tenant-switcher';
import AppNavbar from '../sidebar-layout/app-navbar';
import BellNotifications from './bell-notifications';
import { CustomTrigger } from './custom-trigger';
import LocaleSwitcher from './locale-switcher';
import UserAction from './UserAction';

const Header = React.memo(() => {
    const isMounted = useMount();

    const { session, currentTenant, isSystem } = useTenant();
    const { isMobile } = useSidebar();

    const [config] = themeConfig();

    const isHorizontal = config.layout === 'horizontal';
    const tenantName = session?.user?.tenantName;

    if (!isMounted) return null;

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

                    {!isMobile && !isSystem && (
                        <span className='font-medium'>
                            {currentTenant?.name ?? tenantName ?? 'System'}
                        </span>
                    )}

                    {isSystem && isHorizontal && (
                        <TenantSwitcher />
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
                    <AppNavbar />
                </div>
            )}
        </>
    );
});

Header.displayName = "Header";
export default Header;