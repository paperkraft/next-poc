export const hasPermission = (rolePermissions: number, permissionBit: number): boolean => {
    return (rolePermissions & permissionBit) === permissionBit;
};
  