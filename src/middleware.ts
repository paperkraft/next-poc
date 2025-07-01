import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { getPathAccess } from './utils/accessPath';
import { findModuleByPath } from './utils/findModuleByPath';
import { logAccessDenied } from './utils/log';

export async function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;
    const response = NextResponse.next();

    // Skip middleware for these paths to prevent loops
    if (['/access-denied', '/tenant-access-denied'].includes(currentPath)) {
        return response;
    }

    try {
        // const tenantId = req.cookies.get('x-tenant-id')?.value
        // const tenantSlug = req.cookies.get('x-tenant-slug')?.value

        const token = await getToken({ req, secret: process.env.AUTH_SECRET });
        const session = token ? JSON.parse(JSON.stringify(token)) : null;
        const pathAccess = getPathAccess(currentPath);

        // Set headers for debugging/analytics
        response.headers.set('x-current-path', currentPath);
        response.headers.set('x-tenant-id', session?.user?.tenantId?.toString() || 'none');

        // Extract tenant slug from path: /[tenant-slug]/...
        const pathSegments = currentPath.split('/').filter(Boolean);
        const tenantSlug = pathSegments[0];

        // Determine if user is super admin (from session)
        const isSuperAdmin = session?.user?.globalRoles?.includes('SYSTEM_ADMIN');
        const isTenantRoute = tenantSlug && !['signin', 'signup'].includes(tenantSlug);

        // 1. Handle ignored paths
        if (pathAccess === 'ignored') {
            return response;
        }

        // 2. Handle public/landing pages
        if (pathAccess === 'public' || pathAccess === 'landing') {
            if (session) {
                // Auto-redirect logged-in users to their default tenant dashboard
                const redirectPath = isSuperAdmin ? '/admin/dashboard' : `/${session.user?.slug}/dashboard`;
                if (!currentPath.startsWith(`/${redirectPath}`)) {
                    return NextResponse.redirect(new URL(`${redirectPath}`, req.url));
                }
            }
            return response;
        }

        // 3.  Authentication required
        if (!session) {
            const loginUrl = new URL('/signin', req.url);
            if (pathAccess === 'module' || pathAccess === 'private') {
                loginUrl.searchParams.set('callbackUrl', req.url);
            }
            return NextResponse.redirect(loginUrl);
        }

        // 4. Super admin access rules
        if (isSuperAdmin) {
            return response;
        }

        // 5. Tenant route validation
        if (isTenantRoute) {
            // Check if user has access to this tenant
            const userTenants = session.user?.slug;
            if (!userTenants) {
                logAccessDenied(session, currentPath);
                throw new TenantAccessError('Access to this tenant is denied');
            }

        }

        // 6. Module permission check
        if (pathAccess === 'module') {
            const userModules = session.user?.modules || [];
            const hasModuleAccess = userModules ? findModuleByPath(userModules, currentPath) : null;

            if (!hasModuleAccess) {
                logAccessDenied(session, currentPath);
                return NextResponse.redirect(new URL('/access-denied', req.url));
            }
        }

        // Add tenant info to headers for server components
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set("x-tenant-slug", tenantSlug)
        requestHeaders.set("x-original-path", currentPath)

        // Continue with the request, keeping the path structure
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })


    } catch (error) {
        console.error('Middleware error:', {
            path: req.nextUrl.pathname,
            error: error instanceof Error ? error.message : error,
        });

        if (error instanceof TenantAccessError) {
            return NextResponse.redirect(new URL('/tenant-access-denied', req.url));
        }

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)'],
};


export class TenantAccessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TenantAccessError';
    }
}