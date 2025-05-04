'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { MenuIcon } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';
import HeaderBreadcrumb from './breadcrum-nav';
import BellNotifications from './bell-notifications';
import LocaleSwitcher from './locale-switcher';
import { useIsMobile } from '@/hooks/use-mobile';
import { themeConfig } from '@/hooks/use-config';
import UserAction from './UserAction';
import ThemeConfig from '@/components/layout/ThemeCustomizer';
import Navbar from './navbar';
import AppLogo from '../custom/app-initial';
import { cn } from '@/lib/utils';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

const Header: React.FC = React.memo(() => {
    const mounted = useMounted();
    const isMobile = useIsMobile();
    const [config] = themeConfig();

    if (!mounted) return null;

    return (
        //w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
        <>
            <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
                <div className={cn("flex items-center gap-2 w-full",
                    { "container mx-auto border-b-0 px-8": config.content === 'compact' },
                )}>

                    {(isMobile || config.layout === "vertical") && (
                        <>
                            <CustomTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </>
                    )}
                    {!isMobile && config.layout !== "horizontal" && <HeaderBreadcrumb />}
                    {!isMobile && config.layout === "horizontal" && <AppLogo />}

                    <div className='ml-auto'>
                        <div className='flex gap-2'>
                            {!isMobile && <ThemeConfig />}
                            {!isMobile && <LocaleSwitcher />}
                            <BellNotifications />
                            {config.layout === "horizontal" && <UserAction />}
                        </div>
                    </div>
                </div>
            </header>
            {
                !isMobile && config.layout === "horizontal" &&
                <div className="border-b py-1">
                    <Navbar />
                </div>
            }
        </>
    );
});

Header.displayName = "Header";
export default Header;