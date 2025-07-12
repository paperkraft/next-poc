import type { MenuGroup } from '@prisma/client';
import { MenuItem } from '@/lib/menus';

export type ModuleWithRelations = MenuItem & {
    group: MenuGroup | null;
    children: MenuItem[];
    parent: MenuItem | null;
}

export type ModuleNode = {
    id: number;
    name: string;
    path?: string;
    icon?: string;
    parentId?: number;
    groupId?: number;
    groupName?: string;
    position?: number;
    permissions?: number;
    children: ModuleNode[];
};

export type FetchModulesResponse = {
    success: boolean;
    message: string;
    data?: MenuItem[] | null;
};

// Unique Module
export type ChildModule = {
    id: number;
    name: string;
    path: string | null;
    children: {
        id: number;
        name: string;
        path: string | null;
    }[];
};

export type ModuleWithChildren = {
    id: number;
    name: string;
    path: string | null;
    parentId: number | null;
    groupId: number | null;
    groupName?: string;
    children: ChildModule[];
};

export type FetchModuleResponse = {
    success: boolean;
    message: string;
    data?: ModuleWithChildren | null;
};