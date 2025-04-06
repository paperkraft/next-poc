// permission-context.ts

type RolePermissionEntry = {
    moduleName: string;
    permissionBits: number;
};

export class PermissionContext {
    private permissionMap: Map<string, number>;

    constructor(rolePermissions: RolePermissionEntry[]) {
        this.permissionMap = new Map();
        for (const perm of rolePermissions) {
            this.permissionMap.set(perm.moduleName, perm.permissionBits);
        }
    }

    /**
     * Check if a permission is allowed for a specific module name
     * @param moduleName - Name of the module
     * @param requiredPermission - Bitmask value of the required permission
     */
    isAllowed(moduleName: string, requiredPermission: number): boolean {
        const permissionBits = this.permissionMap.get(moduleName);
        if (!permissionBits) return false;
        return (permissionBits & requiredPermission) === requiredPermission;
    }

    /**
     * Check if multiple permissions are allowed for a specific module
     * @param moduleName - Name of the module
     * @param requiredPermissions - Array of bitmask values for required permissions
     */
    hasAll(moduleName: string, requiredPermissions: number[]): boolean {
        const permissionBits = this.permissionMap.get(moduleName);
        if (!permissionBits) return false;
        return requiredPermissions.every(
            (perm) => (permissionBits & perm) === perm
        );
    }

    /**
     * Check if at least one of the given permissions is allowed for a module
     * @param moduleName - Name of the module
     * @param requiredPermissions - Array of bitmask values
     */
    hasAny(moduleName: string, requiredPermissions: number[]): boolean {
        const permissionBits = this.permissionMap.get(moduleName);
        if (!permissionBits) return false;
        return requiredPermissions.some(
            (perm) => (permissionBits & perm) === perm
        );
    }

    /**
     * Return raw bitmask for a module by name
     */
    getPermissionBits(moduleName: string): number | undefined {
        return this.permissionMap.get(moduleName);
    }
}
