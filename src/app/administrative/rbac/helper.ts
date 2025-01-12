// ----------------------------- Merge default modules with role assigned modules ----------------------------- //
export interface IPermission {
    name: string;
    bitmask: number;
}

export interface IModule {
    id: string;
    name: string;
    parentId: string | null;
    permissions?: IPermission[];
    subModules: IModule[];
}

export type Module = {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    subModules: Module[];
};

export function mergeModules(
    allModules: Module[],
    roleAssignedModules: Module[]
): Module[] {
    // Helper function to merge modules
    function mergeSingleModule(
        module: Module,
        roleAssignedModule: Module | undefined
    ): Module {
        if (roleAssignedModule) {
            module.permissions = roleAssignedModule.permissions;
            module.subModules = mergeSubmodules(
                module.subModules,
                roleAssignedModule.subModules
            );
        }
        return module;
    }

    // Helper function to merge submodules
    function mergeSubmodules(
        allSubmodules: Module[],
        roleAssignedSubmodules: Module[]
    ): Module[] {
        return allSubmodules.map((allSubmodule) => {
            const matchingRoleSubmodule = roleAssignedSubmodules.find(
                (roleSubmodule) => roleSubmodule.id === allSubmodule.id
            );
            return mergeSingleModule(allSubmodule, matchingRoleSubmodule);
        });
    }

    // Iterate over all modules and merge them with role-assigned modules
    return allModules.map((allModule) => {
        const roleAssignedModule = roleAssignedModules.find(
            (roleModule) => roleModule.id === allModule.id
        );
        return mergeSingleModule(allModule, roleAssignedModule);
    });
}

// ----------------------------- Format submitted data to API Format ----------------------------- //

interface FormatSubmodule {
    subModuleId: string;
    permissions: number;
    subModules?: FormatSubmodule[];
}

interface FormatModule {
    moduleId: string;
    permissions: number;
    subModules: FormatSubmodule[];
}

export function transformModules(input: Module[]): FormatModule[] {
    return input.map((module) => ({
        moduleId: module.id,
        permissions: module.permissions,
        subModules: transformSubmodules(module.subModules),
    }));
}

function transformSubmodules(input: Module[]): FormatSubmodule[] {
    return input.map((subModule) => ({
        subModuleId: subModule.id,
        permissions: subModule.permissions,
        subModules:
            subModule.subModules.length > 0
                ? transformSubmodules(subModule.subModules)
                : [],
    }));
}

// ----------------------------- Update submited data from previous data  ----------------------------- //

function createIdMap(data: Module[]): Map<string, Module> {
    const map = new Map<string, Module>();
    data.forEach((module) => map.set(module.id, module));
    return map;
}

function hasValidPermissions(module: Module): boolean {
    // Check if a module or any of its submodules has permissions > 0
    if (module.permissions > 0) {
        return true;
    }

    // Check if any submodule has permissions > 0
    for (let subModule of module.subModules) {
        if (hasValidPermissions(subModule)) {
            return true;
        }
    }
    return false;
}

export function updateModules(
    submittedData: Module[],
    previousData: Module[]
): Module[] {
    const mapPreviousData = createIdMap(previousData);

    return submittedData
        .map((subModule) => {
            const prevModule = mapPreviousData.get(subModule.id);

            // If the module exists in previous data, update permissions and recurse on submodules
            if (prevModule) {
                const updatedSubmodules = updateModules(subModule.subModules, prevModule.subModules);
                return {
                    ...subModule,
                    permissions: subModule.permissions,
                    subModules: updatedSubmodules,
                };
            }

            // If the module does not exist in previous data and its permissions > 0, include it
            if (subModule.permissions > 0 || hasValidPermissions(subModule)) {
                return {
                    ...subModule,
                    subModules: updateModules(subModule.subModules, []),
                };
            }

            // If no valid submodules and permissions == 0, exclude the module
            return null;
        })
        .filter(Boolean) as Module[]; // Filter out null values
}