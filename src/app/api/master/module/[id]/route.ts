import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type GroupedModule = {
    id: string;
    name: string;
    parentId: string | null;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    subModules: GroupedModule[];
};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const roleId = url.pathname.split("/").pop();

    if (!roleId) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        // Fetch modules and submodules from Prisma database with permissions
        const modules = await prisma.module.findMany({
            where: {
                modulePermissions: {
                    some: {
                        roleId: roleId,
                    },
                },
            },
            include: {
                modulePermissions: {
                    where: {
                        roleId: roleId,
                    },
                },
                subModules: {
                    include: {
                        modulePermissions: {
                            where: {
                                roleId: roleId,
                            },
                        },
                        subModules: {
                            include: {
                                modulePermissions: {
                                    where: {
                                        roleId: roleId,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    
        const groupedModules = modules.map(module => {
            return mapToGroupedModule(module);
        });

        console.log('groupedModules',JSON.stringify(groupedModules, null, 2));
    
        // Respond with the grouped modules
        return NextResponse.json(
            { success: true, data: groupedModules },
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

function mapToGroupedModule(module: any): GroupedModule {
    // Extract the module permissions for the role
    const permissions = module.modulePermissions[0];
    return {
        id: module.id,
        name: module.name,
        parentId: module.parentId,
        canCreate: permissions?.canCreate ?? false,
        canRead: permissions?.canRead ?? false,
        canUpdate: permissions?.canUpdate ?? false,
        canDelete: permissions?.canDelete ?? false,
        canManage: permissions?.canManage ?? false,
        subModules: module.subModules ? module.subModules.map((subModule: any) => mapToGroupedModule(subModule)) : [],
    };
}