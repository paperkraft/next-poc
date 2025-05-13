import type { Module, Group } from '@prisma/client';

export type ModuleWithRelations = Module & {
    group: Group | null;
    children: Module[];
    parent: Module | null;
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