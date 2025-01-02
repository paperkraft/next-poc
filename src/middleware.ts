// export { auth as middleware } from "@/auth"

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermissions } from './lib/rbac';

const ROUTE_PERMISSIONS: { [key: string]: number[] } = {
    '/student': [1, 2],
};

export async function middleware(req: NextRequest) {
    try {
        const session = await auth();

        const userPermissions  = session?.user?.permissions;
        const currentPath = req.nextUrl.pathname;
        const requiredPermissions = ROUTE_PERMISSIONS[currentPath];

        if (!requiredPermissions) {
            return NextResponse.next();
        }

        const hasRequiredPermissions = hasPermissions(userPermissions , requiredPermissions);

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
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}