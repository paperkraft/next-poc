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
            { success: true, message: 'Success', data: finalModules },
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
            { success: true, message: 'Success', data: finalModules },
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

export async function fetchModuleByRole(roleId: string) {

    if (!roleId) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
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
                        path: true,
                        group: true,
                        parentId: true,
                    },
                },
                subModule: {
                    select: {
                        id: true,
                        name: true,
                        path: true,
                        parentId: true,
                    },
                },
                permissions: true,
            },
        });

        const modules = RoleModules(roleModules);

        return NextResponse.json(
            { success: true, message: 'Success', data: modules },
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

type InputModuleFormat = {
    module: {
        id: string;
        name: string;
        path: string | null;
        group: { id: string; name: string } | null;
        parentId: string | null;
    } | null;
    subModule: {
        id: string;
        name: string;
        path: string | null;
        parentId: string | null;
    } | null;
    permissions: number;
};

interface ModuleEntry {
    id: string;
    name: string;
    path: string | null;
    group: string | undefined;
    parentId: string | null;
    permissions: number;
}

interface RoleModulesProps extends ModuleEntry {
    subModules: RoleModulesProps[];
}

function createModuleEntry({ id, name, path, group, parentId, permissions }: ModuleEntry): RoleModulesProps {
    return { id, name, path, group, parentId, permissions, subModules: [] };
}

function RoleModules(data: InputModuleFormat[]): RoleModulesProps[] {
    const moduleMap = new Map<string, RoleModulesProps>();

    data.forEach(({ module, subModule, permissions }) => {
        if (module) {
            if (!moduleMap.has(module.id)) {
                moduleMap.set(module.id, createModuleEntry({
                    id: module.id,
                    name: module.name,
                    path: module?.path,
                    group: module.group?.name,
                    parentId: module.parentId,
                    permissions
                }));
            }
        }

        if (subModule) {
            if (!moduleMap.has(subModule.id)) {
                moduleMap.set(subModule.id, createModuleEntry({
                    id: subModule.id,
                    name: subModule.name,
                    path: subModule?.path,
                    group: undefined,
                    parentId: subModule.parentId,
                    permissions
                }));
            }

            const subModuleEntry = moduleMap.get(subModule.id)!;
            if (subModule.parentId && moduleMap.has(subModule.parentId)) {
                const parentModule = moduleMap.get(subModule.parentId)!;
                if (!parentModule.subModules.some(sm => sm.id === subModule.id)) {
                    parentModule.subModules.push(subModuleEntry);
                }
            }
        }
    });

    return Array.from(moduleMap.values()).filter(module => !module.parentId);
}