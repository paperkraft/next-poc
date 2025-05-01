export function getPathAccess(pathname: string) {
    if (pathname === '/') return 'public';

    if (
        pathname === '/' ||
        pathname.startsWith('/signin') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/forgot-password')
    ) {
        return 'auth-public';
    }

    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/sw.js') ||
        pathname.startsWith('/_next/image') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/web-app-manifest') ||
        pathname.startsWith('/manifest.webmanifest')
    ) {
        return 'ignored'; // Don't handle in middleware
    }

    // Eveything else is private
    return 'private';
}