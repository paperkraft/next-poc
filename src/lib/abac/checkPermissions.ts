import { ActionParam, ALL_PERMISSIONS, PermissionAction } from "@/types/permissions";
import { isABACAllowed } from "./isABACAllowed";
import { ModuleNode } from "@/types/modules";

type BaseParams = {
    moduleId?: number;
    path?: string;
    name?: string;
    modules: ModuleNode[];
};

function normalizeActions(action: ActionParam): PermissionAction[] {
    if (action === "ALL" || action === "ANY") return ALL_PERMISSIONS;
    return Array.isArray(action) ? action : [action];
}

function createChecker(requireAll: boolean) {
    return (params: BaseParams & { action: ActionParam }) =>
        isABACAllowed({
            ...params,
            action: normalizeActions(params.action),
            requireAll,
        });
}

export const can = createChecker(false);
export const canAny = createChecker(false);
export const canAll = createChecker(true);