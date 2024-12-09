interface ISubModule {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number | null;
    subModules: ISubModule[];
}

interface IModule {
    id: string;
    name: string;
    group?: string | null | undefined;
    parentId: string | null;
    permissions: number | null;
    subModules: ISubModule[];
    [x:string]: any;
}

export const findModuleId = (modules: IModule[], moduleName: string): string | null => {
    for (const module of modules) {
        if (module.name === moduleName) {
            return module.id;
        }

        if (module.subModules && module.subModules.length > 0) {
            const subModuleId = findModuleId(module.subModules, moduleName);
            if (subModuleId) return subModuleId;
        }
    }
    return null;
};