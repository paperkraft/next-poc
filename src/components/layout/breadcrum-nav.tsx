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
import { getBreadcrumbsFromGroupedMenus } from './getBreadcrums';
import { useTenant } from '@/context/TenantProvider';

function truncate(text: string, maxLength: number = 20): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export default function HeaderBreadcrumb() {
    const isMounted = useMount();
    const path = usePathname();

    const { menus } = useTenant();

    const breadcrumb = useMemo(() => {
        if (!isMounted || !path || menus.length === 0) return [];
        return getBreadcrumbsFromGroupedMenus(menus, path);
    }, [menus, path, isMounted]);

    if (!isMounted || breadcrumb.length === 0) return null;

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