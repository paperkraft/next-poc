import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermissions } from './lib/rbac';
import { publicURL, ROUTE_PERMISSIONS } from './constants/routes';

export async function middleware(req: NextRequest) {
    try {
        const session = await auth();
        const currentPath = req?.nextUrl?.pathname;

        // Skip session check for public URLs
        if (publicURL.includes(currentPath)) {
            return NextResponse.next();
        }

        // Skip permission checks if there are no required permissions for the current path
        const requiredPermissions = ROUTE_PERMISSIONS[currentPath];
        if (!requiredPermissions) return NextResponse.next();

        // Ensure user has the required permissions
        const userPermissions = session?.user?.permissions || [];
        const hasRequiredPermissions = hasPermissions(userPermissions, requiredPermissions);

        if (!hasRequiredPermissions) {
            return new NextResponse('Forbidden: You do not have permission to access this resource', { status: 403 });
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Middleware error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};