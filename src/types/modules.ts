import type { MenuItem, MenuGroup } from '@prisma/client';

export type ModuleWithRelations = MenuItem & {
    group: MenuGroup | null;
    children: MenuItem[];
    parent: MenuItem | null;
}

export type ModuleNode = {
    id: string;
    name: string;
    path?: string;
    parentId?: string;
    groupId?: string;
    groupName?: string;
    position?: number;
    permissions?: number;
    children: ModuleNode[];
};

export type FetchModulesResponse = {
    success: boolean;
    message: string;
    data?: ModuleNode[] | null;
};

// Unique Module
export type ChildModule = {
    id: string;
    name: string;
    path: string | null;
    children: {
        id: string;
        name: string;
        path: string | null;
    }[];
};

export type ModuleWithChildren = {
    id: string;
    name: string;
    path: string | null;
    parentId: string | null;
    groupId: string | null;
    groupName?: string;
    children: ChildModule[];
};

export type FetchModuleResponse = {
    success: boolean;
    message: string;
    data?: ModuleWithChildren | null;
};