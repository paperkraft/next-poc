import { ActionParam, ALL_PERMISSIONS } from "@/types/permissions";
import { GroupedMenus } from "../menus";
import { findMatchingMenuItem } from "./find-modules";

interface ABACCheck {
    action: ActionParam;
    modules: GroupedMenus[];
    path?: string;
    name?: string;
    moduleId?: number;
    requireAll?: boolean;
}

function getPermissionBit(action: ActionParam): number {
    switch (action) {
        case "READ": return 1;
        case "WRITE": return 2;
        case "UPDATE": return 4;
        case "DELETE": return 8;
        default: return 0;
    }
}

function normalizeActions(action: ActionParam): number[] {
    const actions = action === "ALL" ? ALL_PERMISSIONS : Array.isArray(action) ? action : [action];
    return actions.map(getPermissionBit);
}

export function isABACAllowed({
    action,
    modules,
    moduleId,
    path,
    name,
    requireAll = true,
}: ABACCheck): boolean {

    if (!modules) return false;
    const requiredBits = normalizeActions(action);
    const matchedModule = findMatchingMenuItem(modules, { id: moduleId, name, path });
    if (!matchedModule) return false;
    const permissions = matchedModule.permission;

    return requireAll
        ? requiredBits.every((bit) => (permissions && permissions & bit) === bit)
        : requiredBits.some((bit) => (permissions && permissions & bit) === bit);
}