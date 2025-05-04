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
