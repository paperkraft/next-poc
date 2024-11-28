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

        const userModulesGrouped = await prisma.modulePermission.findMany({
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
                subModule: {
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
    subModule: {
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
    subModules: StructuredData[];
};

function nestModules(data: ModulePermission[]): StructuredData[] {
    const moduleMap = new Map<string, StructuredData>();

    data && data.forEach(({ module, subModule, permissions }) => {
        if (module) {
            if (!moduleMap.has(module.id)) {
                moduleMap.set(module.id, {
                    id: module.id,
                    name: module.name,
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
                    parentId: subModule.parentId,
                    permissions: 0,
                    subModules: [],
                });
            }

            // Aggregate permissions
            const subModuleEntry = moduleMap.get(subModule.id)!;
            subModuleEntry.permissions += permissions;

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