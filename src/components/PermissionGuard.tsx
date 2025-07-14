"use client";

import { useSession } from 'next-auth/react';
import { ReactNode, useMemo } from 'react';

import { isABACAllowed } from '@/lib/abac/isABACAllowed';
import { ActionParam } from '@/types/permissions';
import { useMount } from '@/hooks/use-mount';

interface PermissionGuardProps {
    action: ActionParam;
    moduleId?: number;
    path?: string;
    name?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export function PermissionGuard({
    action,
    moduleId,
    path,
    name,
    children,
    fallback = null,
}: PermissionGuardProps) {
    const isMounted = useMount();
    const { data: session, status } = useSession();

    // Return the fallback content while loading or if no session exists
    if (status === "loading" || !session) {
        return <>{fallback}</>;
    }

    const modules = session?.user?.modules ?? []

    // Check if the user has the required permissions using ABAC
    const isAllowed = useMemo(() => isABACAllowed({
        action,
        moduleId,
        path,
        name,
        modules
    }), [action, moduleId, path, name, modules]);

    if (!isMounted) return null

    // Render children if permission is granted, otherwise fallback
    return isAllowed ? <>{children}</> : <>{fallback}</>;
}