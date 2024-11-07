'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { data, menuType } from './data';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

function getBreadcrumbs(menus: any[], url: string): { title: string, url: string }[] | null {
    function findBreadcrumbs(submenus: any[], url: string, breadcrumb: { title: string, url: string }[] = []): { title: string, url: string }[] | null {
        for (const submenu of submenus) {
            if (submenu.url === url) {
                breadcrumb.push({ title: submenu.title, url: submenu.url });
                return breadcrumb;
            }

            if (submenu.submenu) {
                breadcrumb.push({ title: submenu.title, url: submenu.url });
                const result = findBreadcrumbs(submenu.submenu, url, breadcrumb);
                if (result) return result;
                breadcrumb.pop();
            }
        }
        return null;
    }

    for (const menuGroup of menus) {
        if (menuGroup.url === url) {
            return [{ title: menuGroup.title, url: menuGroup.url }];
        }

        const result = findBreadcrumbs(menuGroup.submenu, url, [{ title: menuGroup.title, url: menuGroup.url }]);
        if (result) {
            return result;
        }
    }
    return null;
}



const Header: React.FC = React.memo(() => {
    const path = usePathname();
    const breadcrumb = getBreadcrumbs(data, path);

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
                        {
                            breadcrumb?.map((item)=>(
                                <React.Fragment key={item.title}>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href={"#"}>{item.title}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))
                        }
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
});

Header.displayName = "Header";

export default Header;