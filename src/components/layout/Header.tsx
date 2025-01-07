'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { BellDot, MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { data, menuType, submenuType } from './data';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserAction from './UserAction';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

function getBreadcrumbs(menus: menuType[], url: string): {label:string, title: string, url: string }[] | null {

    function findBreadcrumbs(submenus: submenuType[], url: string, breadcrumb: { label: string, title: string, url: string }[] = []): { label:string, title: string, url: string }[] | null {
        for (const submenu of submenus) {
            if (submenu.url === url) {
                breadcrumb.push({label: breadcrumb.at(0)?.label as string, title: submenu.title, url: submenu.url });
                return breadcrumb;
            }

            if (submenu.submenu) {
                breadcrumb.push({label: breadcrumb.at(0)?.label as string, title: submenu.title, url: submenu.url });
                const result = findBreadcrumbs(submenu.submenu, url, breadcrumb);
                if (result) return result;
                breadcrumb.pop();
            }
        }
        return null;
    }

    for (const menuGroup of menus) {
        if (menuGroup.url === url) {
            return [{label: menuGroup.label, title: menuGroup.title, url: menuGroup.url }];
        }

        const result = findBreadcrumbs(menuGroup.submenu, url, [{ label: menuGroup.label, title: menuGroup.title, url: menuGroup.url }]);

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
            <div className="flex items-center gap-2 w-full">
                <CustomTrigger />
                
                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">{breadcrumb?.at(0)?.label ?? "Home"}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {
                            breadcrumb?.map((item)=>(
                                <React.Fragment key={item.title}>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem className={cn("hidden md:block",{"":breadcrumb.length - 1})}>
                                        <BreadcrumbLink href={"#"}>{item.title}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))
                        }
                        {
                            breadcrumb &&
                            <BreadcrumbItem className="md:hidden">
                                <BreadcrumbPage>{breadcrumb?.at(breadcrumb.length - 1)?.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        }
                    </BreadcrumbList>
                </Breadcrumb>

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