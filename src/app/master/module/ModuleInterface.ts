export interface IModule {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number | null;
    submodules: IModule[]
}