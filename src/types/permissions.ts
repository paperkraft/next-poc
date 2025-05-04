export type PermissionKey = 'read' | 'write' | 'update' | 'delete';
 
export const PERMISSIONS = {
  READ: 1 << 0,
  WRITE: 1 << 1,
  UPDATE: 1 << 2,
  DELETE: 1 << 3,
} as const;

export type PermissionAction = keyof typeof PERMISSIONS;
export const ALL_PERMISSIONS: PermissionAction[] = Object.keys(PERMISSIONS) as PermissionAction[];

type SpecialAction = "ALL" | "ANY";
export type ActionParam = PermissionAction | PermissionAction[] | SpecialAction;

export interface IRole {
  id: string;
  name: string;
}
export interface IModule {
  id: string;
  name: string;
  path?: string;
  parentId?: string;
  groupId: string;
  groupName: string;
  permissions: number;
  subModules: IModule[];
  position: number;
}
export interface IGroupedModule {
  groupId: string;
  groupName: string;
  modules: IModule[];
}
export interface PermissionPayload {
  moduleId: string;
  permissions: number;
  subModules: PermissionPayload[];
}