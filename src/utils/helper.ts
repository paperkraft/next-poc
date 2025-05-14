import { ModuleNode } from "@/types/modules";

export const findModuleId = (modules: ModuleNode[], moduleName: string): string | undefined => {
    for (const module of modules) {
        if (module.name === moduleName) {
            return module.id as string;
        }

        if (module.children && module.children.length > 0) {
            const subModuleId = findModuleId(module.children, moduleName);
            if (subModuleId) return subModuleId as string;
        }
    }
    return undefined;
};

export const findModuleIdByPath = (modules: ModuleNode[], path: string): string | undefined => {
    for (const module of modules) {
        if (module.path === path) {
            return module.id as string;
        }

        if (module.children && module.children.length > 0) {
            const subModuleId = findModuleId(module.children, path);
            if (subModuleId) return subModuleId as string;
        }
    }
    return undefined;
}