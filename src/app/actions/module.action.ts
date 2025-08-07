import { auth } from "@/auth";
import { MenuItem } from "@/lib/menus";
import prisma from "@/lib/prisma";
import { FetchModuleResponse, FetchModulesResponse, ModuleNode, ModuleWithChildren, ModuleWithRelations } from "@/types/modules";
import { NextResponse } from "next/server";

// Recursive sort by name or custom logic
function sortModules(modules: MenuItem[]): MenuItem[] {
    return modules
        .sort((a, b) => {
            // First sort by group position (nulls last), then by name
            if (a.sortOrder !== b.sortOrder) {
                return (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity);
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

        const session = await auth();

        if (!session) {
            return {
                success: false,
                message: "User session not found.",
                data: [],
            };
        }

        const { tenantId } = session.user;

        const allModules: any[] = await prisma.menuItem.findMany({
            where: tenantId ? { tenantId, isActive: true } : undefined,
            include: {
                children: true,
                parent: true,
                group: true,
            }
        });

        // Build a map for quick lookups
        const moduleMap = new Map<number, MenuItem>();

        for (const mod of allModules) {
            moduleMap.set(mod.id, {
                id: mod.id,
                name: mod.name,
                icon: mod.icon ?? "",
                path: mod.path ?? undefined,
                parentId: mod.parentId ?? undefined,
                groupId: mod.groupId ?? undefined,
                groupName: mod.group?.name,
                sortOrder: mod.group?.sortOrder ?? undefined,
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
        const rootModules: MenuItem[] = Array.from(moduleMap.values()).filter(
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

export async function fetchUniqueModule(id: number): Promise<FetchModuleResponse> {
    if (!id) {
        return { success: false, message: "ID is required", data: null }
    }

    try {
        const module = await prisma.menuItem.findUnique({
            where: { id: +id },
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
            children: module?.children,
        }

        return { success: true, message: "Success", data: finalModule }
    } catch (error) {
        console.error("Error fetching module:", error);
        return { success: false, message: "Error fetching module", data: null }
    }
}

// used in session and auth.
export async function fetchModuleByRole(roleId: number) {

    if (!roleId) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const roleMenus = await prisma.rolePermission.findMany({
            where: { roleId: +roleId },
            include: {
                menus: {
                    include: {
                        group: true,
                        children: true,
                    },
                },
            }
        });

        const formattedModules = RoleModules(roleMenus);

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
    menus: {
        id: number;
        name: string;
        path: string | null;
        parentId: number | null;
        group: { id: number, name: string } | null;
        children: {
            id: number;
            name: string;
            path: string | null;
            parentId: number | null;
        }[];
    };
}

function RoleModules(data: RolePermissionWithModule[]): ModuleNode[] {
    const menuMap = new Map<number, ModuleNode>();

    data.forEach(({ permissionBits, menus }) => {
        const baseModule: ModuleNode = {
            id: menus.id,
            name: menus.name,
            path: menus.path ?? undefined,
            groupId: menus.group?.id,
            groupName: menus.group?.name,
            parentId: menus.parentId ?? undefined,
            permissions: permissionBits,
            children: [],
        };
        menuMap.set(menus.id, baseModule);
    });

    // Nest subModules under their parent
    menuMap.forEach((mod) => {
        if (mod.parentId && menuMap.has(mod.parentId)) {
            menuMap.get(mod.parentId)?.children.push(mod);
        }
    });

    // Return only root-level modules
    return Array.from(menuMap.values()).filter((mod) => !mod.parentId);
}