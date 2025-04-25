'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { Module } from '@/types/module';
import { findModuleByPath } from '@/utils/findModuleByPath';
import { publicURL } from '@/constants/routes';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

export function GlobalAuthGuard({ children, fallback = null }: Props) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [denied, setDenied] = useState(false);

    const router = useRouter();
    const isPublicPath = pathname === '/' || publicURL.some((p) => pathname.startsWith(p));

    useEffect(() => {
        if (status === 'loading') return;

        if (isPublicPath) {
            setDenied(false);
            return;
        }

        const modules = session?.user?.modules as Module[] | undefined;
        const matched = modules ? findModuleByPath(modules, pathname) : null;

        if (!matched) {
            setDenied(true);
            // Optionally redirect instead
            router.replace('/access-denied');
        } else {
            setDenied(false);
        }
    }, [pathname, status, session]);

    if (status === 'loading') return null;

    if (denied) {
        return (
            fallback || (
                <div className="text-center text-red-500 p-6 text-lg font-semibold">
                    Access Denied
                </div>
            )
        );
    }

    return <>{children}</>;
}