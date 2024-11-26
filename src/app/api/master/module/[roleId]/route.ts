import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { roleId: string } }) {
    const { roleId } = params;

    if (!roleId) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {

        const userModulesGrouped = await prisma.modulePermissions.findMany({
            where: {
                roleId: roleId,
            },
            select: {
                module: {
                    select: {
                        id: true,
                        name: true,
                        parentId: true,
                    },
                },
                submodule: {
                    select: {
                        id: true,
                        name: true,
                        parentId: true,
                    },
                },
                permissions: true,
                // submoduleId: true,
            },
        });

        const structuredData = nestModules(userModulesGrouped);

        // Respond with the grouped modules
        return NextResponse.json(
            { success: true, data: structuredData },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error fetching modules' },
            { status: 500 }
        );
    }
}

type ModulePermission = {
    module: {
        id: string;
        name: string;
        parentId: string | null;
    } | null;
    submodule: {
        id: string;
        name: string;
        parentId: string | null;
    } | null;
    permissions: number;
};

type StructuredData = {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    submodules: StructuredData[];
};

function nestModules(data: ModulePermission[]): StructuredData[] {
    const moduleMap = new Map<string, StructuredData>();

    data && data.forEach(({ module, submodule, permissions }) => {
        if (module) {
            if (!moduleMap.has(module.id)) {
                moduleMap.set(module.id, {
                    id: module.id,
                    name: module.name,
                    parentId: module.parentId,
                    permissions: permissions,
                    submodules: [],
                });
            }

            // Aggregate permissions
            // const moduleEntry = moduleMap.get(module.id)!;
            // moduleEntry.permissions += permissions;
        }

        if (submodule) {
            if (!moduleMap.has(submodule.id)) {
                moduleMap.set(submodule.id, {
                    id: submodule.id,
                    name: submodule.name,
                    parentId: submodule.parentId,
                    permissions: 0,
                    submodules: [],
                });
            }

            // Aggregate permissions
            const submoduleEntry = moduleMap.get(submodule.id)!;
            submoduleEntry.permissions += permissions;

            // Nest the submodule under its parent module
            if (submodule.parentId && moduleMap.has(submodule.parentId)) {
                const parentModule = moduleMap.get(submodule.parentId)!;
                if (!parentModule.submodules.some(sm => sm.id === submodule.id)) {
                    parentModule.submodules.push(submoduleEntry);
                }
            }
        }
    });

    // Return only top-level modules (no parentId)
    return Array.from(moduleMap.values()).filter(module => !module.parentId);
}