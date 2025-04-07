// types/permissions.ts
export type PermissionKey = 'read' | 'write' | 'update' | 'delete';


export const PERMISSIONS: Record<PermissionKey, number> = {
  read: 1 << 0,
  write: 1 << 1,
  update: 1 << 2,
  delete: 1 << 3,
}

export interface IRole {
  id: string;
  name: string;
}
export interface IModule {
  id: string;
  name: string;
  parentId: string | null;
  subModules: IModule[];
  permissions: number;
}

export interface ModuleWithChildren {
  id: string;
  name: string;
  parentId: string | null;
  children: ModuleWithChildren[];
  permissions?: number; // from RolePermission
}
