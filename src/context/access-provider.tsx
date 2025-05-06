'use client';

import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getPathAccess } from '@/utils/accessPath';
import { findModuleByPath } from '@/utils/findModuleByPath';
import { logAccessDenied } from '@/utils/log';
import type { Session } from 'next-auth';
import type { Module } from '@/types/module';

interface Props {
    session: Session | null;
    children: React.ReactNode;
    currentPath: string;
}

export function AccessProvider({ session, children, currentPath }: Props) {
    const pathAccess = getPathAccess(currentPath);
    const router = useRouter();

    useEffect(() => {
        if (
            currentPath === '/signin' ||
            currentPath === '/not-found' ||
            currentPath === '/access-denied'
        ) {
            return;
        }

        // 1. Public or landing route — if logged in, redirect to dashboard
        if ((pathAccess === 'public' || pathAccess === 'landing') && session) {
            if (currentPath !== '/dashboard') {
                router.replace('/dashboard');
            }
            return;
        }

        // 2. Unknown route → 404
        if (pathAccess === 'unknown') {
            if (currentPath !== '/not-found') {
                router.replace('/not-found');
            }
            return;
        }

        // 3. Protected (private/module) route
        if (!session) {
            if (pathAccess === 'module' || pathAccess === 'private') {
                const loginUrl = `/signin?callbackUrl=${encodeURIComponent(currentPath)}`;
                router.replace(loginUrl);
            }
            return;
        }

        // 4. Private → allow
        if (pathAccess === 'private') return;

        // 5. Module → check permission
        if (pathAccess === 'module') {
            const modules = session.user.modules as Module[] | undefined;
            const matched = modules ? findModuleByPath(modules, currentPath) : null;

            if (!matched) {
                const isKnown = modules?.some((mod) =>
                    findModuleByPath([mod], currentPath)
                );

                if (!isKnown) {
                    if (currentPath !== '/not-found') {
                        router.replace('/not-found');
                    }
                } else {
                    logAccessDenied(session, currentPath);
                    if (currentPath !== '/access-denied') {
                        router.replace('/access-denied');
                    }
                }
            }
        }
    }, [session, currentPath, pathAccess, router]);

    return <SessionProvider session={session}>{children}</SessionProvider>;
}
