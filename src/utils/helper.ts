interface IModule {
    id: string;
    name: string;
    path?: string;
    parentId?: string;
    groupId: string;
    groupName: string;
    permissions: number;
    subModules: IModule[];
}

export const findModuleId = (modules: IModule[], moduleName: string): string | undefined => {
    for (const module of modules) {
        if (module.name === moduleName) {
            return module.id as string;
        }

        if (module.subModules && module.subModules.length > 0) {
            const subModuleId = findModuleId(module.subModules, moduleName);
            if (subModuleId) return subModuleId as string;
        }
    }
    return undefined;
};

export const findModuleIdByPath = (modules: IModule[], path: string): string | undefined => {
    for (const module of modules) {
        if (module.path === path) {
            return module.id as string;
        }

        if (module.subModules && module.subModules.length > 0) {
            const subModuleId = findModuleId(module.subModules, path);
            if (subModuleId) return subModuleId as string;
        }
    }
    return undefined;
}