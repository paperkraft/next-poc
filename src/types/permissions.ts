import { ModuleNode } from "./modules";

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
export interface IGroupedModule {
  groupId: string;
  groupName: string;
  modules: ModuleNode[];
}
export interface PermissionPayload {
  moduleId: string;
  permissions: number;
  children: PermissionPayload[];
}