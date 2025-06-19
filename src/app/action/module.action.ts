import prisma from "@/lib/prisma";
import { FetchModuleResponse, FetchModulesResponse, ModuleNode, ModuleWithChildren, ModuleWithRelations } from "@/types/modules";
import { NextResponse } from "next/server";

// Recursive sort by name or custom logic
function sortModules(modules: ModuleNode[]): ModuleNode[] {
    return modules
        .sort((a, b) => {
            // First sort by group position (nulls last), then by name
            if (a.position !== b.position) {
                return (a.position ?? Infinity) - (b.position ?? Infinity);
            }
            return a.name.localeCompare(b.name);
        })
        .map((mod) => ({
            ...mod,
            subModules: sortModules(mod.children),
        }));
}

export async function fetchModules(): Promise<FetchModulesResponse> {
    try {
        const allModules: ModuleWithRelations[] = await prisma.module.findMany({
            where: { isActive: true },
            include: {
                children: true,
                parent: true,
                group: true,
            }
        });

        // Build a map for quick lookups
        const moduleMap = new Map<string, ModuleNode>();

        for (const mod of allModules) {
            moduleMap.set(mod.id, {
                id: mod.id,
                name: mod.name,
                path: mod.path ?? undefined,
                parentId: mod.parentId ?? undefined,
                groupId: mod.groupId ?? undefined,
                groupName: mod.group?.name,
                position: mod.group?.position ?? undefined,
                children: [],
            });
        }

        // Link children to their parents
        for (const mod of moduleMap.values()) {
            if (mod.parentId && moduleMap.has(mod.parentId)) {
                moduleMap.get(mod.parentId)!.children.push(mod);
            }
        }

        // Extract top-level modules (no parent)
        const rootModules: ModuleNode[] = Array.from(moduleMap.values()).filter(
            (mod) => !mod.parentId
        );

        return {
            success: true,
            message: 'Success',
            data: sortModules(rootModules)
        }
    } catch (error) {
        console.error("Error fetching modules:", error);
        return {
            success: false,
            message: 'Error fetching modules',
            data: []
        }
    }
}

export async function fetchUniqueModule(id: string): Promise<FetchModuleResponse> {
    if (!id) {
        return { success: false, message: "ID is required", data: null }
    }

    try {
        const module = await prisma.module.findUnique({
            where: { id },
            include: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        path: true,
                        children: {
                            select: {
                                id: true,
                                name: true,
                                path: true,
                            }
                        },
                    }
                },
                group: true,
            },
        });

        if (!module) {
            return { success: false, message: "Module not found", data: null }
        }

        const finalModule: ModuleWithChildren = {
            id: module.id,
            name: module.name,
            path: module.path,
            parentId: module.parentId,
            groupId: module.groupId,
            groupName: module.group?.name,
            children: module.children,
        }

        return { success: true, message: "Success", data: finalModule }
    } catch (error) {
        console.error("Error fetching module:", error);
        return { success: false, message: "Error fetching module", data: null }
    }
}

// used in session and auth.
export async function fetchModuleByRole(roleId: string) {

    if (!roleId) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const roleModules = await prisma.rolePermission.findMany({
            where: { roleId },
            include: {
                module: {
                    include: {
                        group: true,
                        children: true,
                    },
                },
            }
        });

        const formattedModules = RoleModules(roleModules);

        return NextResponse.json(
            { success: true, message: 'Success', data: formattedModules },
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

interface RolePermissionWithModule {
    permissionBits: number;
    module: {
        id: string;
        name: string;
        path: string | null;
        parentId: string | null;
        group: { id: string, name: string } | null;
        children: {
            id: string;
            name: string;
            path: string | null;
            parentId: string | null;
        }[];
    };
}

function RoleModules(data: RolePermissionWithModule[]): ModuleNode[] {
    const moduleMap = new Map<string, ModuleNode>();

    data.forEach(({ permissionBits, module }) => {
        const baseModule: ModuleNode = {
            id: module.id,
            name: module.name,
            path: module.path ?? undefined,
            groupId: module.group?.id,
            groupName: module.group?.name,
            parentId: module.parentId ?? undefined,
            permissions: permissionBits,
            children: [],
        };
        moduleMap.set(module.id, baseModule);
    });

    // Nest subModules under their parent
    moduleMap.forEach((mod) => {
        if (mod.parentId && moduleMap.has(mod.parentId)) {
            moduleMap.get(mod.parentId)?.children.push(mod);
        }
    });

    // Return only root-level modules
    return Array.from(moduleMap.values()).filter((mod) => !mod.parentId);
}