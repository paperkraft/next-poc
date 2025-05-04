import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';

import { Module } from './types/module';
import { findModuleByPath } from './utils/findModuleByPath';
import { logAccessDenied } from './utils/log';
import { getPathAccess } from './utils/accessPath';

export async function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;
    const response = NextResponse.next();
    response.headers.set('x-current-path', req.nextUrl.pathname);
     const session = await auth();

    // let session: Session | null = null;
    const pathAccess = getPathAccess(currentPath);

    // 1. Ignored paths: allow through without auth
    if (pathAccess === 'ignored') {
        return response;
    }

    // 2. Public routes: allow if not authenticated; redirect to /dashboard if already logged in
    if (pathAccess === 'public' || pathAccess === 'landing') {
        // const session = await auth();
        if (session) {
            const dashboardUrl = new URL('/dashboard', req.url);
            return NextResponse.redirect(dashboardUrl);
        }
        return response;
    }

    // 3. Unknown path: rewrite to 404 page
    if (pathAccess === 'unknown') {
        return NextResponse.rewrite(new URL('/not-found', req.url));
    }

    // 4. All other routes require authentication
    // const session = await auth();

    // If not logged in, redirect to signin (with callback only if path is known)
    if (!session) {
        const loginUrl = new URL('/signin', req.url);
        //  Only set callback URL if the path is known (i.e., not unknown)
        if (pathAccess === 'module' || pathAccess === 'private') {
            loginUrl.searchParams.set('callbackUrl', req.url);
        }
        return NextResponse.redirect(loginUrl);
    }

    // 5. Private route: auth is enough
    if (pathAccess === 'private') {
        return response;
    }

    // 6. Module-protected route: check permissions
    if (pathAccess === 'module') {
        const modules = session.user.modules as Module[] | undefined;
        const matched = modules ? findModuleByPath(modules, currentPath) : null;

        if (!matched) {
            // Path may be valid but user lacks access
            const isKnown = modules?.some((mod) =>
                findModuleByPath([mod], currentPath)
            );

            if (!isKnown) {
                // Path isn't valid even for any module → 404
                return NextResponse.rewrite(new URL('/not-found', req.url));
            }

            // Valid path, but not authorized
            logAccessDenied(session, currentPath);
            return NextResponse.redirect(new URL('/access-denied', req.url));
        }
        // Authorized
        return response;
    }

    // Fallback
    return response;
}

export const config = {
    matcher: [
        // '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|.*\\.png$).*)'
        '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)'
    ],
};
