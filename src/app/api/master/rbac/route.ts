import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


// Define the structure for submodules and modules
interface SubmoduleData {
    id: string;
    permissions: number;
    submodules?: SubmoduleData[]; // Optional, for nested submodules
}

interface ModuleData {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    submodules: SubmoduleData[];
}

interface AssignedSubmodule {
    submoduleId: string;
    permissions: number;
}

interface ModuleAssignmentInput {
    roleId: string;
    assignedModules: ModuleData[];
}

export async function POST(req: Request) {
    const { roleId, modulesData } = await req.json();
    try {

        const result = await assignModulesToRole(roleId, modulesData);

        return NextResponse.json(
            { success: true, message: 'RBAC assigned', result },
            { status: 200 }
        );

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to create' }, { status: 500 });
    }
}


async function assignModulesToRole(roleId: string, modulesWithPermissions: { moduleId: string; permissions: number; submodules: { submoduleId: string; permissions: number }[] }[]) {
    const assignments = [];

    for (const moduleData of modulesWithPermissions) {
        // Assign the module permissions to the role
        const modulePermission = await prisma.modulePermissions.create({
            data: {
                roleId: roleId, // Role to which we are assigning the permissions
                moduleId: moduleData.moduleId,
                permissions: moduleData.permissions, // Permissions for the module
            },
        });
        assignments.push(modulePermission);

        // Now assign permissions for each submodule (if any)
        for (const submodule of moduleData.submodules) {
            const submodulePermission = await prisma.modulePermissions.create({
                data: {
                    roleId: roleId, // Role to which we are assigning the permissions
                    moduleId: moduleData.moduleId,
                    submoduleId: submodule.submoduleId, // Submodule ID
                    permissions: submodule.permissions, // Permissions for the submodule
                },
            });
            assignments.push(submodulePermission);
        }
    }

    return assignments; // Return the list of assignments made
}


async function assignModulesToRoleUpsert(roleId: string, modulesWithPermissions: { moduleId: string; permissions: number; submodules: { submoduleId: string; permissions: number }[] }[]) {
    const assignments = [];

    for (const moduleData of modulesWithPermissions) {
        // Check if the module permission for this role exists, if not create it
        const modulePermission = await prisma.modulePermissions.upsert({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: moduleData.moduleId,
                },
            },
            update: {
                permissions: moduleData.permissions, // Update the permissions if already exist
            },
            create: {
                roleId: roleId, // Role ID
                moduleId: moduleData.moduleId, // Module ID
                permissions: moduleData.permissions, // Permissions for the module
            },
        });
        assignments.push(modulePermission);

        // Now check and update or create permissions for each submodule (if any)
        for (const submodule of moduleData.submodules) {
            const submodulePermission = await prisma.modulePermissions.upsert({
                where: {
                    roleId_moduleId_submoduleId: {
                        roleId: roleId,
                        submoduleId: submodule.submoduleId,
                        moduleId: moduleData.moduleId,
                    },
                },
                update: {
                    permissions: submodule.permissions, // Update the submodule permissions if they exist
                },
                create: {
                    roleId: roleId, // Role ID
                    moduleId: moduleData.moduleId, // Module ID
                    submoduleId: submodule.submoduleId, // Submodule ID
                    permissions: submodule.permissions, // Permissions for the submodule
                },
            });
            assignments.push(submodulePermission);
        }
    }

    return assignments; // Return the list of assignments made
}


