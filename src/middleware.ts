import { NextRequest } from 'next/server';

import { handleRequest } from './lib/middleware/handleRequest';

export async function middleware(req: NextRequest) {
    return handleRequest(req);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)'
    ],
};
