"use client";

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

import { isABACAllowed } from '@/lib/abac/isABACAllowed';
import { ActionParam } from '@/types/permissions';

interface PermissionGuardProps {
    action: ActionParam;
    moduleId?: string;
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
    const { data: session, status } = useSession();

    // Return the fallback content while loading or if no session exists
    if (status === "loading" || !session) {
        return <>{fallback}</>;
    }

    // Check if the user has the required permissions using ABAC
    const isAllowed = isABACAllowed({
        action,
        moduleId,
        path,
        name,
        modules: session?.user?.modules ?? [] // Get the user's modules from session
    });

    // Render children if permission is granted, otherwise fallback
    return isAllowed ? <>{children}</> : <>{fallback}</>;
}