import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


interface SubModules {
    submoduleId: string;
    permissions: number;
    submodules: SubModules[]
}

interface Module {
    moduleId: string;
    permissions: number;
    submodules: SubModules[]
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
            if (moduleData.submodules && moduleData.submodules.length > 0) {
                for (const submodule of moduleData.submodules) {
                    await upsertSubmodulePermissions(roleId, moduleData.moduleId, submodule, assignments);
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
    // Check if permissions are 0, in which case we remove the module access by deleting it
    if (moduleData.permissions === 0) {
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

async function upsertSubmodulePermissions(roleId: string, moduleId: string, submodule: SubModules, assignments: any[]) {
    if (submodule.permissions === 0) {
        // If permission is 0, delete the submodule permission
        await prisma.modulePermissions.delete({
            where: {
                roleId_moduleId_submoduleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    submoduleId: submodule.submoduleId,
                },
            },
        });
        assignments.push({ submoduleId: submodule.submoduleId, status: 'deleted' });
    } else {
        // Otherwise, upsert the submodule permission (update or create)
        const submodulePermission = await prisma.modulePermissions.upsert({
            where: {
                roleId_moduleId_submoduleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    submoduleId: submodule.submoduleId,
                },
            },
            // Update the submodule permissions if they exist
            update: {
                permissions: submodule.permissions,
            },
            create: {
                roleId: roleId,
                moduleId: moduleId,
                submoduleId: submodule.submoduleId,
                permissions: submodule.permissions,
            },
        });
        assignments.push(submodulePermission);
    }

    // If the submodule has its own submodules (nested submodules), recursively handle them
    if (submodule.submodules && submodule.submodules.length > 0) {
        for (const nestedSubmodule of submodule.submodules) {
            await upsertSubmodulePermissions(roleId, moduleId, nestedSubmodule, assignments);
        }
    }
}
