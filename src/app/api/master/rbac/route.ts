import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


interface SubModules {
    submoduleId: string;
    permissions: number;
}

interface Module {
    moduleId: string;
    permissions: number;
    submodules: SubModules[]
}

export async function POST(req: Request) {
    const { roleId, modulesData } = await req.json();
    try {

        const result = await assignModulesToRoleUpsertNew(roleId, modulesData);
        return NextResponse.json(
            { success: true, message: 'RBAC assigned', data: result },
            { status: 200 }
        );

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to create' }, { status: 500 });
    }
}

async function assignModulesToRoleUpsertNew(roleId: string, modulesWithPermissions: Module[]) {
    const assignments = [];

    try {
        for (const moduleData of modulesWithPermissions) {
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
            }

            // Now check and update or remove permissions for each submodule (if any)
            if (moduleData.submodules && moduleData.submodules.length > 0) {
                for (const submodule of moduleData.submodules) {
                    if (submodule.permissions === 0) {
                        // If permission is 0, delete the submodule permission
                        await prisma.modulePermissions.delete({
                            where: {
                                roleId_moduleId_submoduleId: {
                                    roleId: roleId,
                                    moduleId: moduleData.moduleId,
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
                                    moduleId: moduleData.moduleId,
                                    submoduleId: submodule.submoduleId,
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
            }
        }

        return assignments; // Return the list of assignments made
    } catch (error) {
        console.error('Error assigning modules to role:', error);
        throw new Error('Failed to assign modules to role');
    }
}
