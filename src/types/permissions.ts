import { MenuItem } from "@/lib/menus";

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
  groupId: number;
  groupName: string;
  modules: MenuItem[];
}
export interface PermissionPayload {
  moduleId: number;
  permissions: number;
  children: PermissionPayload[];
}