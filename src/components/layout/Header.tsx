'use client'
import React from 'react';

import ThemeConfig from '@/components/layout/ThemeCustomizer';
import { Separator } from '@/components/ui/separator';
import { themeConfig } from '@/hooks/use-config';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

import { TooltipWrapper } from '../common/tootip-wrapper';
import AppLogo from '../custom/app-initial';
import BellNotifications from './bell-notifications';
import HeaderBreadcrumb from './breadcrum-nav';
import LocaleSwitcher from './locale-switcher';
import Navbar from './navbar';
import { CustomTrigger } from './Sidebar/custom-trigger';
import UserAction from './UserAction';

const Header: React.FC = React.memo(() => {
    const mounted = useMounted();
    const isMobile = useIsMobile();
    const [config] = themeConfig();

    if (!mounted) return null;

    const isHorizontal = config.layout === 'horizontal';

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

                    {!isMobile && !isHorizontal && <HeaderBreadcrumb />}
                    {!isMobile && isHorizontal && <AppLogo />}

                    <div className='ml-auto flex gap-2'>
                        {!isMobile && (
                            <>
                                <TooltipWrapper tooltip="Theme Config">
                                    <ThemeConfig />
                                </TooltipWrapper>
                                <TooltipWrapper tooltip="Language">
                                    <LocaleSwitcher />
                                </TooltipWrapper>
                            </>
                        )}
                        <TooltipWrapper tooltip='Notification'>
                            <BellNotifications />
                        </TooltipWrapper>
                        {isHorizontal && <UserAction />}
                    </div>
                </div>
            </header>

            {!isMobile && isHorizontal && (
                <div className="border-b py-1">
                    <Navbar />
                </div>
            )}
        </>
    );
});

Header.displayName = "Header";
export default Header;