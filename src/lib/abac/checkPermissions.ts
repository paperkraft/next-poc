import { ActionParam, ALL_PERMISSIONS, IModule, PermissionAction } from "@/types/permissions";
import { isABACAllowed } from "./isABACAllowed";

type BaseParams = {
    moduleId?: string;
    path?: string;
    name?: string;
    modules: IModule[];
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