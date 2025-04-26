import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';

import { privatePaths, publicPaths } from './constants/routes';
import { Module } from './types/module';
import { findModuleByPath } from './utils/findModuleByPath';
import { logAccessDenied } from './utils/log';

export async function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;

    // Always allow public paths
    if (currentPath === '/' || publicPaths.some((p) => currentPath.startsWith(p))) {
        return NextResponse.next();
    }

    const session: Session | null = await auth();

    // If not authenticated, redirect to login
    if (!session) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url); // optional: redirect back after login
        return NextResponse.redirect(loginUrl);
    }

    // Allow private paths if authenticated
    if (privatePaths.some((p) => currentPath.startsWith(p))) {
        return NextResponse.next();
    }

    // Now check modules
    const modules = session.user.modules as Module[] | undefined;
    const matched = modules ? findModuleByPath(modules, currentPath) : null;

    if (!matched) {
        logAccessDenied(session, currentPath);
        // Redirect to access denied page
        const accessDeniedUrl = new URL('/access-denied', req.url);
        return NextResponse.redirect(accessDeniedUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|api|images|icons).*)",
    ],
};
