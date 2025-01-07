import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermissions } from './lib/rbac';

const ROUTE_PERMISSIONS: { [key: string]: number[] } = {
    '/student': [1, 2, 20],
};

const publicURL = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
    try {
        const session = await auth();
        const currentPath = req?.nextUrl?.pathname;

        // Skip session check for public URLs
        if (publicURL.includes(currentPath)) {
            return NextResponse.next();
        }

        // Handle non-authenticated access (redirect to /signin if not logged in)
        if (!session && currentPath !== "/") {
            const signInUrl = new URL("/signin", req?.nextUrl?.origin);
            return NextResponse.redirect(signInUrl);
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
