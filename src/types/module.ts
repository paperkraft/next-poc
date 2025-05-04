export interface Module {
    id: string;
    name: string;
    path: string;
    group?: string;
    parentId?: string | null;
    permissions: number;
    subModules?: Module[];
}
