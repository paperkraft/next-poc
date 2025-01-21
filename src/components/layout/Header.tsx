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
import HeaderNavigationMenu from './header-navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { themeConfig } from '@/hooks/use-config';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

const Header: React.FC = React.memo(() => {
    const mounted = useMounted();
    const isMobile = useIsMobile();
    const [theme] = themeConfig();

    if (!mounted) return null;

    return (
        //w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
            <div className="flex items-center gap-2 w-full">
                
                {theme.layout !== "navbar" && (
                    <>
                        <CustomTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <HeaderBreadcrumb />
                    </>
                )}

                {!isMobile && theme.layout === "navbar" && <HeaderNavigationMenu />}

                <div className='ml-auto'>
                    <div className='flex gap-2'>
                        <LocaleSwitcher />
                        <BellNotifications />
                    </div>
                </div>
            </div>
        </header>
    );
});

Header.displayName = "Header";
export default Header;