import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermissions } from './lib/rbac';
import { publicURL, ROUTE_PERMISSIONS } from './constants/routes';

export async function middleware(req: NextRequest) {
    try {
        const currentPath = req?.nextUrl?.pathname;

        // Get session (user authentication)
        const session = await auth();

        // Allow public URLs without authentication
        if (publicURL.includes(currentPath)) {
            if (session) {
                return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
            }
            return NextResponse.next();
        }

        // Skip permission checks if there are no required permissions for the current path
        const requiredPermissions = ROUTE_PERMISSIONS[currentPath];
        if (!requiredPermissions) return NextResponse.next();

        // Validate user's permissions
        const userPermissions = session?.user?.permissions ?? [];
        if (!hasPermissions(userPermissions, requiredPermissions)) {
            return new NextResponse('Forbidden: You do not have permission to access this resource', { status: 403 });
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Middleware error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}