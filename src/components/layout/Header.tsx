'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { BellDot, MenuIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMounted } from '@/hooks/use-mounted';
import HeaderBreadcrumb from './breadcrum-nav';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

const Header: React.FC = React.memo(() => {
    const mounted = useMounted();
    if(!mounted) return null

    return (
        //w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
            <div className="flex items-center gap-2 w-full">
                <CustomTrigger />
                
                <Separator orientation="vertical" className="mr-2 h-4" />

                <HeaderBreadcrumb/>

                <div className='ml-auto'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'ghost'} className='size-8'>
                                <BellDot className='size-5'></BellDot>
                            </Button>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             
                            <DropdownMenuItem>Team</DropdownMenuItem>
                             
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
});

Header.displayName = "Header";
export default Header;