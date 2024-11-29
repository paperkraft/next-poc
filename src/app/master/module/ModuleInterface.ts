interface ISubModule {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number | null;
    subModules: ISubModule[];
}

export interface IModule {
    id: string;
    name: string;
    group?: string | null | undefined;
    parentId: string | null;
    permissions: number | null;
    subModules: ISubModule[];
    [x:string]: any;
}

export interface IModuleFormat {
    id: string;
    name: string;
    parentId: string | null;
    subModules: IModuleFormat[] | null
}