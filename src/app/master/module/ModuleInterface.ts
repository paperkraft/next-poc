export interface IModule {
    id: string;
    name: string;
    parentId: string | null;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    subModules: IModule[]
}

export interface IModuleFormat {
    id: string;
    name: string;
    parentId: string | null;
    subModules: IModuleFormat[] | null
}