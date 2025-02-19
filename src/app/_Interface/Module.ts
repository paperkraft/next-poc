import { IGroup } from "./Group";

interface ISubModule {
    id: string;
    name: string;
    path: string;
    parentId: string | null;
    permissions: number | null;
    subModules: ISubModule[];
}

export interface IModule {
    id: string;
    name: string;
    path: string | null;
    group?: string | undefined;
    parentId: string | null;
    permissions: number | null;
    subModules: ISubModule[];
    [x:string]: any;
}

export interface IModuleFormat {
    id: string;
    name: string;
    path: string;
    parentId: string | null;
    subModules: IModuleFormat[] | null
}


export interface InputFormat {
    id: string,
    name: string,
    path: string;
    group?: IGroup | null;
    parentId: string | null,
    subModules: InputFormat[] | null
}


export interface IOption {
    label: string;
    value: string;
}