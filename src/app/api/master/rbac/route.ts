import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


interface SubModules {
    subModuleId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    subModules: SubModules[]
}

interface Module {
    moduleId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    subModules: SubModules[]
}

export async function POST(req: Request) {
    const { roleId, modulesData } = await req.json();
    try {
        const result = await UpsertAssignModulesToRole(roleId, modulesData);
        return NextResponse.json(
            { success: true, message: 'Module Assigned', data: result },
            { status: 200 }
        );

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to assign' }, { status: 500 });
    }
}

async function UpsertAssignModulesToRoleOO(roleId: string, modulesWithPermissions: Module[]) {
    const assignments: any[] = [];

    try {
        for (const moduleData of modulesWithPermissions) {
            // Process the main module
            await upsertModulePermissionsOO(roleId, moduleData, assignments);

            // Process nested submodules (if any)
            if (moduleData.subModules && moduleData.subModules.length > 0) {
                for (const submodule of moduleData.subModules) {
                    await upsertSubModulePermissionsOO(roleId, moduleData.moduleId, submodule, assignments);
                }
            }
        }

        return assignments;
    } catch (error) {
        console.error('Error assigning modules to role:', error);
        throw new Error('Failed to assign modules to role');
    }
}

async function upsertModulePermissionsOO(roleId: string, moduleData: Module, assignments: any[]) {
    // Check if permissions are 0, in which case we remove the module access by deleting it
    if (moduleData.canCreate === false 
        && moduleData.canRead === false
        && moduleData.canUpdate === false
        && moduleData.canDelete === false
    ) {
        // Delete the module permission for the role
        await prisma.modulePermissions.delete({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: moduleData.moduleId,
                },
            },
        });
        assignments.push({ moduleId: moduleData.moduleId, status: 'deleted' });
    } else {
        // Otherwise, upsert the module permission (update or create)
        const modulePermission = await prisma.modulePermissions.upsert({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: moduleData.moduleId,
                },
            },
            // Update the module permissions if they exist
            update: {
                canCreate:moduleData.canCreate,
                canRead:moduleData.canRead,
                canUpdate:moduleData.canUpdate,
                canDelete:moduleData.canDelete,
            },
            create: {
                roleId: roleId,
                moduleId: moduleData.moduleId,
                canCreate:moduleData.canCreate,
                canRead:moduleData.canRead,
                canUpdate:moduleData.canUpdate,
                canDelete:moduleData.canDelete,
            },
        });
        assignments.push(modulePermission);
    }
}

async function upsertSubModulePermissionsOO(roleId: string, moduleId: string, subModule: SubModules, assignments: any[]) {
    if (subModule.canCreate === false
        && subModule.canRead === false
        && subModule.canUpdate === false
        && subModule.canDelete === false
    ) {
        // If permission is 0, delete the submodule permission
        await prisma.modulePermissions.delete({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: subModule.subModuleId,
                },
            },
        });
        assignments.push({ submoduleId: subModule.subModuleId, status: 'deleted' });
    } else {
        // Otherwise, upsert the submodule permission (update or create)
        const submodulePermission = await prisma.modulePermissions.upsert({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: subModule.subModuleId,
                },
            },
            // Update the submodule permissions if they exist
            update: {
                canCreate:subModule.canCreate,
                canRead:subModule.canRead,
                canUpdate:subModule.canUpdate,
                canDelete:subModule.canDelete,
            },
            create: {
                roleId: roleId,
                moduleId: moduleId,
                subModuleId: subModule.subModuleId,
                canCreate:subModule.canCreate,
                canRead:subModule.canRead,
                canUpdate:subModule.canUpdate,
                canDelete:subModule.canDelete,
            },
        });
        assignments.push(submodulePermission);
    }

    // If the submodule has its own submodules (nested submodules), recursively handle them
    if (subModule.subModules && subModule.subModules.length > 0) {
        for (const nestedSubmodule of subModule.subModules) {
            await upsertSubModulePermissionsOO(roleId, moduleId, nestedSubmodule, assignments);
        }
    }
}


// ---------------------------------------

async function UpsertAssignModulesToRole(roleId: string, modulesWithPermissions: Module[]) {
    const assignments: any[] = [];

    for (const moduleData of modulesWithPermissions) {
        const moduleChanges = await upsertModulePermissions(roleId, moduleData);
        if (moduleChanges) assignments.push(moduleChanges);

        if (moduleData.subModules?.length > 0) {
            for (const submodule of moduleData.subModules) {
                const submoduleChanges = await upsertSubModulePermissions(roleId, moduleData.moduleId, submodule);
                if (submoduleChanges) assignments.push(submoduleChanges);
            }
        }
    }

    return assignments;
}

async function upsertModulePermissions(roleId: string, moduleData: Module) {
    if (isEmptyPermission(moduleData)) {
        await prisma.modulePermissions.delete({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: moduleData.moduleId,
                },
            },
        });
        return { moduleId: moduleData.moduleId, status: 'deleted' };
    } else {
        return await prisma.modulePermissions.upsert({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: moduleData.moduleId,
                },
            },
            update: moduleData,
            create: { ...moduleData, roleId },
        });
    }
}

async function upsertSubModulePermissions(roleId: string, moduleId: string, subModule: SubModules) {
    if (isEmptyPermission(subModule)) {
        await prisma.modulePermissions.delete({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: subModule.subModuleId,
                },
            },
        });
        return { submoduleId: subModule.subModuleId, status: 'deleted' };
    } else {
        return await prisma.modulePermissions.upsert({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: subModule.subModuleId,
                },
            },
            update: subModule,
            create: { ...subModule, roleId, moduleId },
        });
    }
}

// Helper function to check if permission is empty (no access)
function isEmptyPermission(permission: { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }) {
    return !permission.canCreate && !permission.canRead && !permission.canUpdate && !permission.canDelete;
}