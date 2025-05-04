import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { Module } from '@/types/module';
import { getPathAccess } from '@/utils/accessPath';
import { findModuleByPath } from '@/utils/findModuleByPath';
import { logAccessDenied } from '@/utils/log';

export async function handleRequest(req: NextRequest): Promise<NextResponse> {
    try {
        const currentPath = req.nextUrl.pathname;
        const response = NextResponse.next();
        response.headers.set('x-current-path', currentPath);

        const pathAccess = getPathAccess(currentPath);

        // 1. Allow ignored paths
        if (pathAccess === 'ignored') return response;

        const session: Session | null = await auth();

        // 2. Public or landing: redirect to dashboard if logged in
        if (pathAccess === 'public' || pathAccess === 'landing') {
            if (session) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return response;
        }

        // 3. Unknown path → 404
        if (pathAccess === 'unknown') {
            return NextResponse.rewrite(new URL('/not-found', req.url));
        }

        // 4. Require auth from here on
        if (!session) {
            const loginUrl = new URL('/signin', req.url);
            if (pathAccess === 'module' || pathAccess === 'private') {
                loginUrl.searchParams.set('callbackUrl', req.url);
            }
            return NextResponse.redirect(loginUrl);
        }

        // 5. Private route → auth is enough
        if (pathAccess === 'private') return response;

        // 6. Module-protected route: check permission
        if (pathAccess === 'module') {
            const modules = session.user.modules as Module[] | undefined;
            const matched = modules ? findModuleByPath(modules, currentPath) : null;

            if (!matched) {
                const isKnown = modules?.some(mod => findModuleByPath([mod], currentPath));

                if (!isKnown) {
                    return NextResponse.rewrite(new URL('/not-found', req.url));
                }

                logAccessDenied(session, currentPath);
                return NextResponse.redirect(new URL('/access-denied', req.url));
            }

            return response;
        }

        // Default allow
        return response;
    } catch (error) {
        console.error('Middleware error:', {
            path: req.nextUrl.pathname,
            error,
        });

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
