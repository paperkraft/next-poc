import { MODULE_PATH_PREFIXES, PRIVATE_PATHS, PUBLIC_PATHS } from "@/constants/routes";

export type PathAccessType = 'ignored' | 'landing' | 'public' | 'private' | 'module' | 'unknown';

export function getPathAccess(path: string): PathAccessType {

    const IGNORED_PATHS = [
        /^\/api/,
        /^\/_next\//,
        /^\/favicon\.ico$/,
        /^\/.*\.(png|jpg|svg|ico|webmanifest|txt)$/,
    ];

    // Check ignored paths
    if (IGNORED_PATHS.some((re) => re.test(path))) return 'ignored';

    // Exact public paths
    if (PUBLIC_PATHS.includes(path)) return 'public';

    // Specific "landing" treatment
    if (path === '/') return 'landing';

    // Private routes (authenticated but not permissioned)
    // if (PRIVATE_PATHS.includes(path)) return 'private'; // exact
    if (PRIVATE_PATHS.some((prefix) => path.startsWith(prefix))) return 'private';

    // Permission-based (module) paths
    if (MODULE_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) return 'module';

    // If not matched, path is unknown
    return 'unknown';
}