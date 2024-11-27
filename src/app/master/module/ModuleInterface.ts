export interface IModule {
    id: string;
    name: string;
    group: string | null;
    parentId: string | null;
    permissions: number | null;
    submodules: IModule[]
}

export interface IModuleFormat {
    id: string;
    name: string;
    parentId: string | null;
    submodules: IModuleFormat[] | null
}