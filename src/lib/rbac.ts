/**
 * Check if the user has a specific permission from the bitmask
 * @param userPermissions - The bitmask value of the user's permissions
 * @param requiredPermission - The bitmask value of the required permission
 * @returns boolean - True if the user has the required permission
 */
export function hasPermission(userPermissions: number, requiredPermission: number): boolean {
    return (userPermissions & requiredPermission) === requiredPermission;
}

/**
 * Check if a user has multiple permissions (e.g., Read, Write, Delete)
 * @param userPermissions - The bitmask value of the user's permissions
 * @param requiredPermissions - An array of bitmask values for the required permissions
 * @returns boolean - True if the user has all required permissions
 */
export function hasPermissions(userPermissions: number, requiredPermissions: number[]): boolean {
    return requiredPermissions.every(permission => (userPermissions & permission) === permission);
}


/**
 * Check if a user has a required permission (bitmask) for a module
 * @param rolePermissions - Array of RolePermission objects from DB
 * @param moduleId - The module ID to check permissions for
 * @param requiredPermission - The bitmask of the required permission (e.g. VIEW = 1)
 * @returns boolean
 */
export function isPermissionAllowed(
    rolePermissions: { moduleId: string; permissionBits: number }[],
    moduleId: string,
    requiredPermission: number
  ): boolean {
    const modulePermission = rolePermissions.find((perm) => perm.moduleId === moduleId);
    if (!modulePermission) return false;
  
    return (modulePermission.permissionBits & requiredPermission) === requiredPermission;
  }
  
  /**
   * Check if a user has ALL or ANY required permissions for a module
   * @param rolePermissions - Array of RolePermission objects from DB
   * @param moduleId - The module ID to check permissions for
   * @param requiredPermissions - Array of bitmask values (e.g. [1, 2])
   * @param matchAll - If true, user must have ALL; if false, any one is enough
   * @returns boolean
   */
  export function arePermissionsAllowed(
    rolePermissions: { moduleId: string; permissionBits: number }[],
    moduleId: string,
    requiredPermissions: number[],
    matchAll = true
  ): boolean {
    const modulePermission = rolePermissions.find((perm) => perm.moduleId === moduleId);
    if (!modulePermission) return false;
  
    return matchAll
      ? requiredPermissions.every((perm) => (modulePermission.permissionBits & perm) === perm)
      : requiredPermissions.some((perm) => (modulePermission.permissionBits & perm) === perm);
  }
  