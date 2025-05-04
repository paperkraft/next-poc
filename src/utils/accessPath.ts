import { normalizePath } from "./findModuleByPath";

export type PathAccessType = 'ignored' | 'auth-public' | 'public' | 'private';

export function getPathAccess(pathname: string): PathAccessType {
    const normalized = normalizePath(pathname);

    if (normalized === '/') return 'public';

    if (
        normalized === '/' ||
        normalized.startsWith('/signin') ||
        normalized.startsWith('/signup') ||
        normalized.startsWith('/forgot-password')
    ) {
        return 'auth-public';
    }

    if (
        normalized.startsWith('/api') ||
        normalized.startsWith('/sw.js') ||
        normalized.startsWith('/_next') ||
        normalized.startsWith('/images') ||
        normalized.startsWith('/favicon.ico') ||
        normalized.startsWith('/manifest.webmanifest')
        // normalized.startsWith('/web-app-manifest') ||
    ) {
        return 'ignored';
    }

    // Eveything else is private
    return 'private';
}