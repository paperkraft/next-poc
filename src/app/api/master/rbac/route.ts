import prisma from "@/lib/prisma";
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

// ---------------------------------------


async function UpsertAssignModulesToRole(roleId: string, modulesWithPermissions: any[]) {
    const assignments: any[] = []; // Array to track changes (for logging, debugging, or returning results)

    for (const moduleData of modulesWithPermissions) {
        // Upsert permissions for the main module
        const moduleChanges = await upsertModulePermissions(roleId, moduleData);
        if (moduleChanges) assignments.push(moduleChanges);

        // Upsert permissions for submodules if present
        if (moduleData.subModules?.length > 0) {
            for (const submodule of moduleData.subModules) {
                const submoduleChanges = await upsertSubModulePermissions(roleId, moduleData.id, submodule);
                if (submoduleChanges) assignments.push(submoduleChanges);
            }
        } else {
            // If the parent has no submodules and all its permissions are false, consider deletion
            if (isEmptyPermission(moduleData) && moduleData.subModules.length === 0) {
                const parentPermissionExists = await prisma.modulePermission.findUnique({
                    where: {
                        roleId_moduleId: {
                            roleId: roleId,
                            moduleId: moduleData.id,
                        },
                    },
                });

                if (parentPermissionExists) {
                    await prisma.modulePermission.delete({
                        where: {
                            roleId_moduleId: {
                                roleId: roleId,
                                moduleId: moduleData.id,
                            },
                        },
                    });
                    assignments.push({ moduleId: moduleData.id, status: 'deleted' });
                }
            }
        }
    }

    return assignments; // Return all changes made for modules and submodules
}

async function upsertModulePermissions(roleId: string, moduleData: any) {
    const { id, canCreate, canRead, canUpdate, canDelete, canManage } = moduleData;

    // If all permissions are false and the module has no submodules, delete the module
    if (isEmptyPermission(moduleData)) {
        const existingModulePermission = await prisma.modulePermission.findUnique({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: id,
                },
            },
        });

        if (existingModulePermission) {
            await prisma.modulePermission.delete({
                where: {
                    roleId_moduleId: {
                        roleId: roleId,
                        moduleId: id,
                    },
                },
            });
            return { moduleId: id, status: 'deleted' };
        }
        return { moduleId: id, status: 'not found, not deleted' };
    } else {
        // Upsert the module permissions (either create or update)
        return await prisma.modulePermission.upsert({
            where: {
                roleId_moduleId: {
                    roleId: roleId,
                    moduleId: id,
                },
            },
            update: {
                canCreate: canCreate ?? false,
                canRead: canRead ?? false,
                canUpdate: canUpdate ?? false,
                canDelete: canDelete ?? false,
                canManage: canManage ?? false,
                updatedBy: moduleData.updatedBy ?? null,
                updatedAt: new Date(),
            },
            create: { 
                roleId,
                moduleId: id,
                canCreate: canCreate ?? false,
                canRead: canRead ?? false,
                canUpdate: canUpdate ?? false,
                canDelete: canDelete ?? false,
                canManage: canManage ?? false,
                createdBy: moduleData.createdBy ?? null,
                createdAt: moduleData.createdAt ?? new Date(),
            },
        });
    }
}

async function upsertSubModulePermissions(roleId: string, moduleId: string, subModule: any) {
    const { id, canCreate, canRead, canUpdate, canDelete, canManage } = subModule;

    // If all submodule permissions are false, delete the submodule
    if (isEmptyPermission(subModule)) {
        const existingSubModulePermission = await prisma.modulePermission.findUnique({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: id,
                },
            },
        });

        if (existingSubModulePermission) {
            await prisma.modulePermission.delete({
                where: {
                    roleId_moduleId_subModuleId: {
                        roleId: roleId,
                        moduleId: moduleId,
                        subModuleId: id,
                    },
                },
            });
            return { subModuleId: id, status: 'deleted' };
        }
        return { subModuleId: id, status: 'not found, not deleted' };
    } else {
        // Upsert the submodule permissions (either create or update)
        return await prisma.modulePermission.upsert({
            where: {
                roleId_moduleId_subModuleId: {
                    roleId: roleId,
                    moduleId: moduleId,
                    subModuleId: id,
                },
            },
            update: {
                canCreate: canCreate ?? false,
                canRead: canRead ?? false,
                canUpdate: canUpdate ?? false,
                canDelete: canDelete ?? false,
                canManage: canManage ?? false,
                updatedBy: subModule.updatedBy ?? null,
                updatedAt: new Date(),
            },
            create: { 
                roleId, 
                moduleId,
                subModuleId: id,
                canCreate: canCreate ?? false,
                canRead: canRead ?? false,
                canUpdate: canUpdate ?? false,
                canDelete: canDelete ?? false,
                canManage: canManage ?? false,
                createdBy: subModule.createdBy ?? null,
                createdAt: subModule.createdAt ?? new Date(),
            },
        });
    }
}

// Helper function to check if permission is empty (no access)
function isEmptyPermission(permission: { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean; canManage: boolean }) {
    return !(permission.canCreate || permission.canRead || permission.canUpdate || permission.canDelete || permission.canManage);
}
