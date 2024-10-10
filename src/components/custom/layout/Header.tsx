'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu} from 'lucide-react';
import SidebarMenu from "./Sidebar";
import UserAction from './UserAction';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';

const Header:React.FC = React.memo(()=>{
    return (
        <header className={cn("h-16 fixed top-0 z-50 flex sm:justify-start sm:flex-nowrap w-full bg-primary dark:bg-background dark:text-white text-sm py-4 border-b items-center")}>
            <nav className="max-w-full w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <div className="sm:hidden">
                            <Sheet>
                                <SheetTrigger className='text-white mt-2'><Menu /></SheetTrigger>
                                <SheetContent side={"left"} className="w-[300px] sm:w-[340px]">
                                    <SheetHeader>
                                        Webdesk
                                        <SheetTitle className='text-left text-xl font-bold hidden'></SheetTitle>
                                        <div>
                                            <SheetDescription></SheetDescription>
                                            <SidebarMenu />
                                        </div>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <Link className="hidden ml-4 relative md:block text-white" href="/">
                            Webdesk
                        </Link>
                    </div>
                    <UserAction />
                </div>
            </nav>
        </header>
    );
});

Header.displayName = "Header";

export default Header;