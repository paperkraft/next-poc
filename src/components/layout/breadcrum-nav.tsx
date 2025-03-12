'use client';

import React, { useMemo } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useMounted } from '@/hooks/use-mounted';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { getBreadcrumbs, mapMenu } from './Sidebar/helper';

export default function HeaderBreadcrumb() {
    const mounted = useMounted();
    const path = usePathname();
    const { data: session } = useSession();

    const menus = session?.user?.modules;
    const formattedMenus = menus ? mapMenu(menus) : [];
    const breadcrumb = useMemo(() => {
        return path && formattedMenus ? getBreadcrumbs(formattedMenus, path) : [];
    }, [formattedMenus, path]);

    if (!mounted) return null;

    const firstBreadcrumb = breadcrumb?.[0];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">{firstBreadcrumb?.label ?? "Home"}</BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumb?.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem className={cn("hidden md:block", { "": breadcrumb.length - 1 })}>
                            <BreadcrumbLink href="#">{item.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}

                {breadcrumb && breadcrumb?.length > 0 && (
                    <BreadcrumbItem className="md:hidden">
                        <BreadcrumbPage>{breadcrumb[breadcrumb.length - 1]?.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

