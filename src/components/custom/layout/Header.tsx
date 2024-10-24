'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { data } from './data';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

function getTitleAndParentByUrl(data: any, url: string) {
    for (const entry of data) {
        // Check if the current entry matches the url
        if (entry.url === url) {
            return { parentTitle: entry.title };
        }

        // Check in submenu if it exists
        if (entry.submenu) {
            const submenuItem = entry.submenu.find((sub: any) => sub.url === url);
            if (submenuItem) {
                return { parentTitle: entry.title, childTitle: submenuItem.title };
            }
        }
    }
    return null;
}

const Header: React.FC = React.memo(() => {
    const path = usePathname();
    const breadcrumb = getTitleAndParentByUrl(data, path);

    return (
        //w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
            <div className="flex items-center gap-2">
                <CustomTrigger />
                
                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>

                        {path !== '/' && <BreadcrumbSeparator className="hidden md:block" />}

                        {breadcrumb?.childTitle
                            ? <React.Fragment>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={"#"}>{breadcrumb?.parentTitle}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{breadcrumb?.childTitle}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </React.Fragment>
                            : <BreadcrumbPage>{breadcrumb?.parentTitle}</BreadcrumbPage>
                        }
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
});

Header.displayName = "Header";

export default Header;