import { ModuleNode } from "@/types/modules";
import { ActionParam, ALL_PERMISSIONS } from "@/types/permissions";
import { GroupedMenus, MenuItem } from "../menus";
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

function matchPath(target: string, modulePath: string) {
    if (!modulePath) return false;
    if (target === modulePath) return true;

    const dynamicPattern = modulePath
        .replace(/\[.*?\]/g, "[^/]+")
        .replace(/\//g, "\\/");

    const exact = new RegExp(`^${dynamicPattern}$`);
    const nested = new RegExp(`^${dynamicPattern}(/.*)?$`);

    return exact.test(target) || nested.test(target);
}

function findMatchingModule(
    modules: ModuleNode[],
    { moduleId, path, name }: Pick<ABACCheck, "moduleId" | "path" | "name">
): ModuleNode | undefined {
    if (moduleId) return modules.find((m) => m.id === moduleId);
    if (path) return modules.find((m) => m.path && matchPath(path, m.path));
    if (name) return modules.find((m) => m.name === name);
    return undefined;
};

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
    // const matchedModule = findMatchingModule(modules, { moduleId, path, name });
    const matchedModule = findMatchingMenuItem(modules, { id: moduleId, name, path });
    if (!matchedModule) return false;
    const permissions = matchedModule.permission;

    return requireAll
        ? requiredBits.every((bit) => (permissions && permissions & bit) === bit)
        : requiredBits.some((bit) => (permissions && permissions & bit) === bit);
}