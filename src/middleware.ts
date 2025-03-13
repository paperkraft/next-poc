import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermissions } from './lib/rbac';
import { publicURL, ROUTE_PERMISSIONS } from './constants/routes';
import { Session } from 'next-auth';

export async function middleware(req: NextRequest) {
    try {
        const currentPath = req?.nextUrl?.pathname;
        const session: Session | null = await auth();

        // 1. Allow Public Routes
        if (publicURL.includes(currentPath)) {
            if (session) {
                return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
            }
            return NextResponse.next();
        }

        // 2. Redirect unauthenticated users
        if (!session) {
            return NextResponse.redirect(new URL('/signin', req.nextUrl.origin));
        }

        // 3. Skip permission check if no specific permissions are required
        const requiredPermissions = ROUTE_PERMISSIONS[currentPath];
        if (!requiredPermissions) return NextResponse.next();

        // 4. Validate user permissions
        const userPermissions = session.user?.permissions ?? [];
        if (!hasPermissions(userPermissions, requiredPermissions)) {
            return new NextResponse('Forbidden: Access denied', { status: 403 });
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Middleware error:', {
            path: req.nextUrl.pathname,
            error,
        });

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// 5. Middleware Config: Exclude Static & API routes
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};