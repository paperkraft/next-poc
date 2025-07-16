export type MenuItem = {
  id: number
  name: string
  group: { name: string } | null
  permissionBits: number
  children?: MenuItem[]
  parentId?: number | null
}

export type FlattenedMenuItem = MenuItem & {
  level: number
  groupName: string
}

export type Role = {
  id: number
  name: string
  description: string | null;
  tenantId: number | null;
}

export const PERMISSION_BITS = {
  READ: 1 << 0,
  WRITE: 1 << 1,
  UPDATE: 1 << 2,
  DELETE: 1 << 3,
} as const

export type PermissionKey = keyof typeof PERMISSION_BITS
