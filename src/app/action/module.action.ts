'use server'

import prisma from "@/lib/prisma";
import { IModule } from "../_Interface/Module";
import { NextResponse } from "next/server";

export async function fetchModules() {
    // Helper function to process a module without permissions
    function formatModule(module: any): IModule {
        return {
            id: module.id,
            name: module.name,
            path: module?.path,
            group: module?.group?.name,
            parentId: module?.parentId,
            permissions: module?.permissions?.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
            subModules: (module?.subModules || []).map((submodule: any) => formatModule(submodule)),
        };
    }

    try {
        const modules = await prisma.module.findMany({
            include: {
                group: true,
                permissions: true,
                subModules: {
                    include: {
                        permissions: true,
                        subModules: {
                            include: {
                                permissions: true,
                                subModules: true
                            },
                        },
                    },
                },
            },
        });

        const formattedModules = modules.map((module) => formatModule(module));
        const submoduleIds = new Set(formattedModules.flatMap((module) => module.subModules.map((subModule) => subModule.id)));
        const finalModules = formattedModules.filter((module) => !submoduleIds.has(module.id));
        return NextResponse.json(
            { success: true, message: 'Success', data: finalModules},
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching modules:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching modules' }, 
            { status: 500 }
        );
    }
}

export async function fetchUniqueModule(id: string) {

    if (!id) {
        // throw new Error('Role ID is required');
        return NextResponse.json(
            { success: false, message: "ID is required" },
            { status: 400 }
        );
    }

    // Helper function to process a module with permissions
    function formatModule(module: any): IModule {
        return {
            id: module?.id,
            name: module?.name,
            path: module?.path,
            group: module?.group?.id,
            parentId: module?.parentId,
            permissions: module?.permissions?.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
            subModules: (module?.subModules || []).map((subModule: any) => formatModule(subModule)),
        };
    }
    try {
        const module = await prisma.module.findUnique({
            where: { id },
            include: {
                group: true,
                permissions: true,
                subModules: {
                    include: {
                        permissions: true,
                        subModules: {
                            include: {
                                permissions: true,
                                subModules: true,
                            },
                        },
                    },
                },
            },
        });

        const finalModules = module && formatModule(module);
        return NextResponse.json(
            { success: true, message: 'Success', data: finalModules},
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching module:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching module' }, 
            { status: 500 }
        );
    }
}

type ModulePermission = {
    module: {
        id: string;
        name: string;
        path: string;
        parentId: string | null;
    } | null;
    subModule: {
        id: string;
        name: string;
        path: string;
        parentId: string | null;
    } | null;
    permissions: number;
};

export async function fetchUniqueModuleByRole(roleId: string) {

    if (!roleId) {
        // throw new Error('Role ID is required');
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    function nestModules(data: ModulePermission[]): IModule[] {
        const moduleMap = new Map<string, IModule>();

        data && data.forEach(({ module, subModule, permissions }) => {
            if (module) {
                if (!moduleMap.has(module.id)) {
                    moduleMap.set(module.id, {
                        id: module.id,
                        name: module.name,
                        path: module.path,
                        parentId: module.parentId,
                        permissions: permissions,
                        subModules: [],
                    });
                }

                // Aggregate permissions
                // const moduleEntry = moduleMap.get(module.id)!;
                // moduleEntry.permissions += permissions;
            }

            if (subModule) {
                if (!moduleMap.has(subModule.id)) {
                    moduleMap.set(subModule.id, {
                        id: subModule.id,
                        name: subModule.name,
                        path: subModule.path,
                        parentId: subModule.parentId,
                        permissions: permissions,
                        subModules: [],
                    });
                }

                // Aggregate permissions
                const subModuleEntry = moduleMap.get(subModule.id)!;
                // subModuleEntry.permissions += permissions;

                // Nest the subModule under its parent module
                if (subModule.parentId && moduleMap.has(subModule.parentId)) {
                    const parentModule = moduleMap.get(subModule.parentId)!;
                    if (!parentModule.subModules.some(sm => sm.id === subModule.id)) {
                        parentModule.subModules.push(subModuleEntry);
                    }
                }
            }
        });

        // Return only top-level modules (no parentId)
        return Array.from(moduleMap.values()).filter(module => !module.parentId);
    }

    try {
        const roleModules = await prisma.modulePermission.findMany({
            where: {
                roleId: roleId,
            },
            select: {
                module: {
                    select: {
                        id: true,
                        name: true,
                        parentId: true,
                        path:true,
                    },
                },
                subModule: {
                    select: {
                        id: true,
                        name: true,
                        parentId: true,
                        path:true,
                    },
                },
                permissions: true,
            },
        });

        const structuredData = nestModules(roleModules);
        return NextResponse.json(
            { success: true, message: 'Success', data: structuredData},
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching modules:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching module' }, 
            { status: 500 }
        );
    }
}

type InputFormat = {
    moduleId: string;
    subModuleId: string | null;
    permissions: number;
    module: {
        id: string;
        name: string;
        path: string;
        parentId: string | null;
    };
    subModule: {
        id: string;
        name: string;
        path: string;
        parentId: string | null;
        subModules: any[];
    } | null;
};

export const getModulesByRole = async (roleId: string) => {

    function formatModules(data: InputFormat[]): IModule[] {
        const moduleMap: Record<string, IModule> = {};

        data?.forEach((item) => {
            const { moduleId, permissions, module, subModule } = item;

            // Create or update the module
            if (!moduleMap[moduleId]) {
                moduleMap[moduleId] = {
                    id: moduleId,
                    name: module.name,
                    path: module.path,
                    parentId: module.parentId,
                    permissions: permissions,
                    subModules: [],
                };
            }

            // If there is a submodule, handle it separately
            if (subModule && subModule.id) {
                const subModuleId = subModule.id;
                const subModuleData: IModule = {
                    id: subModuleId,
                    name: subModule.name,
                    path: subModule.path,
                    parentId: subModule.parentId,
                    permissions: permissions,
                    subModules: [],
                };

                // Handle SubModules (nested submodules)
                if (subModule.subModules && subModule.subModules.length > 0) {
                    subModuleData.subModules = subModule.subModules.map((childSubmodule) => ({
                        id: childSubmodule.id,
                        name: childSubmodule.name,
                        path: childSubmodule.path,
                        parentId: childSubmodule.parentId,
                        permissions: permissions,
                        subModules: [],
                    }));
                }

                // Push the submodule to the corresponding module
                moduleMap[moduleId].subModules.push(subModuleData);
            }
        });
        return Object.values(moduleMap);
    }

    try {
        const roleWithModules = await prisma.role.findUnique({
            where: { id: roleId },
            include: {
                modulePermissions: {
                    include: {
                        module: true,
                        subModule: {
                            include: {
                                subModules: true
                            }
                        }
                    }
                }
            },
        });
        return roleWithModules && formatModules(roleWithModules?.modulePermissions);
    } catch (error) {
        console.error('Error fetching modules with submodules:', error);
        throw new Error('Failed to fetch modules with submodules');
    }
}