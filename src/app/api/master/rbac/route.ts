import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


interface SubModules {
    subModuleId: string;
    permissions: number;
    subModules: SubModules[]
}

interface Module {
    moduleId: string;
    permissions: number;
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

async function UpsertAssignModulesToRole(roleId: string, modulesWithPermissions: Module[]) {
    const assignments: any[] = [];

    try {
        for (const moduleData of modulesWithPermissions) {
            // Process the main module
            await upsertModulePermissions(roleId, moduleData, assignments);

            // Process nested submodules (if any)
            if (moduleData.subModules && moduleData.subModules.length > 0) {
                for (const subModule of moduleData.subModules) {
                    await upsertSubmodulePermissions(roleId, moduleData.moduleId, subModule, assignments);
                }
            }
        }

        return assignments;
    } catch (error) {
        console.error('Error assigning modules to role:', error);
        throw new Error('Failed to assign modules to role');
    }
}

async function upsertModulePermissions(roleId: string, moduleData: Module, assignments: any[]) {
    // Check if the module has any submodules with non-zero permissions
    const hasNonZeroChildPermission = moduleData.subModules && moduleData.subModules.some(subModule => subModule.permissions > 0);
    
    // Check if the module was previously assigned (i.e., exists in the modulePermissions table for the role)
    const existingModulePermission = await prisma.modulePermission.findUnique({
        where: {
            roleId_moduleId: {
                roleId: roleId,
                moduleId: moduleData.moduleId,
            },
        },
    });

    // Check if permissions are 0, in which case we remove the module access by deleting it
    if (moduleData.permissions === 0  && !hasNonZeroChildPermission  && existingModulePermission) {
        // Delete the module permission for the role
        await prisma.modulePermission.delete({
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
        const modulePermission = await prisma.modulePermission.upsert({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: moduleData.moduleId,
                },
            },
            // Update the module permissions if they exist
            update: {
                permissions: moduleData.permissions,
            },
            create: {
                roleId: roleId,
                moduleId: moduleData.moduleId,
                permissions: moduleData.permissions,
            },
        });
        assignments.push(modulePermission);
    }
}

async function upsertSubmodulePermissions(roleId: string, moduleId: string, subModule: SubModules, assignments: any[]) {

    const hasNonZeroChildPermission = subModule.subModules && subModule.subModules.some(subModule => subModule.permissions > 0);

    // If permission is 0 and already assigned, delete the submodule permission
    if (subModule.permissions === 0 && !hasNonZeroChildPermission) {
        await prisma.modulePermission.delete({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: subModule.subModuleId,
                },
            },
        });
        assignments.push({ subModuleId: subModule.subModuleId, status: 'deleted' });
    } else {
        // Otherwise, upsert the submodule permission (update or create)
        const subModulePermission = await prisma.modulePermission.upsert({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: subModule.subModuleId,
                },
            },
            // Update the submodule permissions if they exist
            update: {
                permissions: subModule.permissions,
            },
            create: {
                roleId: roleId,
                moduleId: moduleId,
                subModuleId: subModule.subModuleId,
                permissions: subModule.permissions,
            },
        });
        assignments.push(subModulePermission);
    }

    // If the submodule has its own submodules (nested submodules), recursively handle them
    if (subModule.subModules && subModule.subModules.length > 0) {
        for (const nestedSubModule of subModule.subModules) {
            await upsertSubmodulePermissions(roleId, moduleId, nestedSubModule, assignments);
        }
    }
}