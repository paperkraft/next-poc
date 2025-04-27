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

    const pathAccess = getPathAccess(currentPath);

    // Static asset or API, ignore
    if (pathAccess === 'ignored') {
        return response; 
    }
    
    let session: Session | null = null;

    // Always allow static/public assets
    if (pathAccess === 'auth-public') {
        session = await auth();
        if (session) {
            const dashboardUrl = new URL('/dashboard', req.url);
            return NextResponse.redirect(dashboardUrl);
        }
        return response;
    }

    if (pathAccess === 'public') {
        // Always allow public pages like landing page `/`
        return response;
    }

    // Not public path — must check auth
    session = await auth();

    // If not authenticated, redirect to login
    if (!session) {
        const loginUrl = new URL('/signin', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url); // optional: redirect back after login
        return NextResponse.redirect(loginUrl);
    }

    // Allow private paths if authenticated
    if (pathAccess === 'private') {
        return response;
    }

    //  Check module permissions
    const modules = session.user.modules as Module[] | undefined;
    const matched = modules ? findModuleByPath(modules, currentPath) : null;

    if (!matched) {
        logAccessDenied(session, currentPath);
        // Redirect to access denied page
        const accessDeniedUrl = new URL('/access-denied', req.url);
        return NextResponse.redirect(accessDeniedUrl);
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|api|images|icons).*)",
    ],
};
