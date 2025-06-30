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

export const findModuleIdByPath = (modules: MenuItem[], path: string): number | undefined => {
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

export const findModuleIdByPathNew = (modules: GroupedMenus[], path: string): number | undefined => {
    for (const group of modules) {
        for (const menu of group.modules) {
            if (menu.path === path) {
                return menu.id;
            }

            if (menu.children && menu.children.length > 0) {
                const subModuleId = findModuleIdByPath(menu.children, path);
                if (subModuleId) return subModuleId;
            }
        }
    }
    return undefined;
}