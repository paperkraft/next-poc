import { GroupedMenus, MenuItem } from "@/lib/menus";
import { ModuleNode } from "@/types/modules";

export const findModuleId = (modules: ModuleNode[], moduleName: string): number | undefined => {
    for (const module of modules) {
        if (module.name === moduleName) {
            return module.id;
        }

        if (module.children && module.children.length > 0) {
            const subModuleId = findModuleId(module.children, moduleName);
            if (subModuleId) return subModuleId;
        }
    }
    return undefined;
};

export const findModuleIdByPathOld = (modules: MenuItem[], path: string): number | undefined => {
    for (const module of modules) {
        if (module.path === path) {
            return module.id;
        }

        if (module.children && module.children.length > 0) {
            const subModuleId = findModuleIdByPath(module.children, path);
            if (subModuleId) return subModuleId;
        }
    }
    return undefined;
}

export const findModuleIdByPath = (groups: GroupedMenus[], path: string): number | undefined => {
    for (const group of groups) {
        const found = searchInModules(group.modules, path);
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
};

const searchInModules = (modules: MenuItem[], path: string): number | undefined => {
    for (const module of modules) {
        if (module.path === path) {
            return module.id;
        }

        if (module.children?.length) {
            const childResult = searchInModules(module.children, path);
            if (childResult !== undefined) {
                return childResult;
            }
        }
    }
    return undefined;
};
