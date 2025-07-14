'use client';

import React, { useMemo } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useMount } from '@/hooks/use-mount';
import { usePathname } from 'next/navigation';
import { GroupedMenus } from '@/lib/menus';
import { getBreadcrumbsFromGroupedMenus } from './getBreadcrums';

function truncate(text: string, maxLength: number = 20): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export default function HeaderBreadcrumb({ menus = [] }: { menus: GroupedMenus[] }) {
    const isMount = useMount();
    const path = usePathname();

    const breadcrumb = useMemo(() => {
        if (!isMount || !path || menus.length === 0) return [];
        return getBreadcrumbsFromGroupedMenus(menus, path);
    }, [menus, path, isMount]);

    if (!isMount || breadcrumb.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumb.map((item, idx) => {
                    const isLast = idx === breadcrumb.length - 1;
                    const name = truncate(item.name);
                    return (
                        <React.Fragment key={idx}>
                            {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                            <BreadcrumbItem className="hidden md:block">
                                {isLast ? (
                                    <BreadcrumbPage title={item.name}>{name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={"#"} title={item.name}>{name}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}

                {/* Mobile-only: show only last item */}
                <BreadcrumbItem className="md:hidden">
                    <BreadcrumbPage>{truncate(breadcrumb[breadcrumb.length - 1].name)}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}