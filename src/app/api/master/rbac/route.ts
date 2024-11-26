import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";


interface SubModules {
    subModuleId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    subModules: SubModules[];
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

interface Module {
    moduleId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    subModules: SubModules[]
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export async function POST(req: Request) {
    const { roleId, modulesData } = await req.json();
    try {
        const updatedModule = await updateOrDeleteModulePermissions(roleId, modulesData);
        return NextResponse.json(
            { success: true, message: 'Module Assigned', data: updatedModule },
            { status: 200 }
        );

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to assign' }, { status: 500 });
    }
}

// ---------------------------------------

async function updateOrDeleteModulePermissions(roleId: string, modules: any[]) {
    const result: any[] = [];

    // Process each module
    for (const module of modules) {
        const { id, canCreate, canRead, canUpdate, canDelete, canManage, subModules } = module;

        // Check if all granular permissions for the module are false
        const allPermissionsFalse = !canCreate && !canRead && !canUpdate && !canDelete && !canManage;

        if (allPermissionsFalse) {
            // If all permissions are false, delete the module permissions for the role
            const existingModulePermission = await prisma.modulePermission.findUnique({
                where: {
                    roleId_moduleId: {
                        roleId,
                        moduleId: id,
                    },
                },
            });

            if (existingModulePermission) {
                // Permanently delete the module's permissions for this roleId
                await prisma.modulePermission.delete({
                    where: {
                        roleId_moduleId: {
                            roleId,
                            moduleId: id,
                        },
                    },
                });
                result.push({
                    id,
                    name: module.name,
                    deleted: true,
                });
            }
        } else {
            // If permissions are not all false, update the module permissions
            await prisma.modulePermission.upsert({
                where: {
                    roleId_moduleId: {
                        roleId,
                        moduleId: id,
                    },
                },
                update: {
                    canCreate,
                    canRead,
                    canUpdate,
                    canDelete,
                    canManage,
                },
                create: {
                    roleId,
                    moduleId: id,
                    canCreate,
                    canRead,
                    canUpdate,
                    canDelete,
                    canManage,
                },
            });

            const moduleResult: any = {
                id,
                name: module.name,
                canCreate,
                canRead,
                canUpdate,
                canDelete,
                canManage,
                subModules: [],
            };

            // Recursively process submodules if they exist
            if (subModules && subModules.length > 0) {
                for (const subModule of subModules) {
                    // Recursively handle permissions for submodules
                    const subModuleResult = await processSubModule(roleId, subModule, id);
                    moduleResult.subModules.push(subModuleResult);
                }
            }

            result.push(moduleResult);
        }
    }

    return result;
}

// Helper function to handle recursive processing of submodules
async function processSubModule(roleId: string, subModule: any, parentModuleId: string) {
    const { id, canCreate, canRead, canUpdate, canDelete, canManage, subModules } = subModule;

    // Check if all granular permissions for the submodule are false
    const allPermissionsFalse = !canCreate && !canRead && !canUpdate && !canDelete && !canManage;

    if (allPermissionsFalse) {
        // If all permissions are false, delete the submodule permissions
        const existingModulePermission = await prisma.modulePermission.findUnique({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId,
                    moduleId: parentModuleId,
                    subModuleId: id
                },
            },
        });

        if (existingModulePermission) {

            await prisma.modulePermission.delete({
                where: {
                    roleId_moduleId_subModuleId: {
                        roleId,
                        moduleId: parentModuleId,
                        subModuleId: id,
                    },
                },
            });
            return {
                id,
                name: subModule.name,
                deleted: true,
                subModules: [],
            };
        }

    } else {
        // If permissions are not all false, update or create the submodule permissions
        await prisma.modulePermission.upsert({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId,
                    moduleId: parentModuleId,
                    subModuleId: id,
                },
            },
            update: {
                canCreate,
                canRead,
                canUpdate,
                canDelete,
                canManage,
            },
            create: {
                roleId,
                moduleId: parentModuleId,
                subModuleId: id,
                canCreate,
                canRead,
                canUpdate,
                canDelete,
                canManage,
            },
        });

        const subModuleResult: any = {
            id,
            name: subModule.name,
            canCreate,
            canRead,
            canUpdate,
            canDelete,
            canManage,
            subModules: [],
        };

        // Recursively handle nested submodules
        if (subModules && subModules.length > 0) {
            for (const nestedSubModule of subModules) {
                const nestedSubModuleResult = await processSubModule(roleId, nestedSubModule, id);
                subModuleResult.subModules.push(nestedSubModuleResult);
            }
        }

        return subModuleResult;
    }
}