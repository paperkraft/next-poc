import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { isABACAllowed } from "@/lib/abac/isABACAllowed";
import { PermissionAction } from "@/constants/permissions";
import { Module } from "@/types/permissions";

type PermissionCheckArgs = {
    action: PermissionAction | PermissionAction[];
    moduleId?: string;
    path?: string;
    name?: string;
};

export function usePermissionCheck(debug = false) {
    const { data: session } = useSession();

    const userPermissions = session?.user?.permissions ?? [];
    const modules: Module[] = session?.user?.modules ?? [];

    const checkPermission = useCallback(
        ({ action, moduleId, path, name }: PermissionCheckArgs) => {
            const label = `[PERF] checkPermission(${JSON.stringify({ action, moduleId, path, name })})`;

            performance.mark(`${label}-start`);
            const result = isABACAllowed({
                action,
                moduleId,
                path,
                name,
                userPermissions,
                modules,
            });
            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);

            if (debug) {
                console.groupCollapsed(`[ABAC] checkPermission`);
                console.table({ action, moduleId, path, name, result });
                console.groupEnd();
            }

            return result;
        },
        [userPermissions, modules, debug]
    );

    const checkPermissionsForAllModules = useCallback(
        ({ action }: { action: PermissionAction[] }) => {
            const label = `[PERF] checkPermissionsForAllModules(${JSON.stringify({ action })})`;

            performance.mark(`${label}-start`);

            const results = modules.map((module) =>
                isABACAllowed({
                    action,
                    moduleId: module.id,
                    userPermissions,
                    modules,
                    requireAll: true,
                })
            );

            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);

            if (debug) {
                console.groupCollapsed(`[ABAC] checkPermissionsForAllModules`);
                console.table({ action, results });
                console.groupEnd();
            }

            return results;
        },
        [modules, userPermissions, debug]
    );

    return {
        checkPermission,
        checkPermissionsForAllModules,
    };
}
