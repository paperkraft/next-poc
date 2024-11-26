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
        // const modules = await prisma.module.findMany({
        //     where: {
        //         modulePermissions: {
        //             some: {
        //                 roleId: roleId,
        //             },
        //         },
        //     },
        //     include: {
        //         modulePermissions: {
        //             where: {
        //                 roleId: roleId,
        //             },
        //         },
        //         subModules: {
        //             include: {
        //                 modulePermissions: {
        //                     where: {
        //                         roleId: roleId,
        //                     },
        //                 },
        //                 subModules: {
        //                     include: {
        //                         modulePermissions: {
        //                             where: {
        //                                 roleId: roleId,
        //                             },
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // });

        // const groupedModules = modules.map(module => {
        //     return mapToGroupedModule(module);
        // });

        const modulesWithPermissions = await getModulesByRoleId(roleId);

        const groupedModules =  formatModules(modulesWithPermissions as any)

        // console.log('modulesWithPermissions --- ', JSON.stringify(modulesWithPermissions, null, 2));

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




async function getModulesByRoleId(roleId: string) {
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
                select: {
                    canCreate: true,
                    canRead: true,
                    canUpdate: true,
                    canDelete: true,
                    canManage: true,
                },
            },
            subModules: {
                include: {
                    subModulePermissions: {
                        where: {
                            roleId: roleId
                        },
                        select: {
                            canCreate: true,
                            canRead: true,
                            canUpdate: true,
                            canDelete: true,
                            canManage: true,
                        },
                    },
                    subModules: {
                        include: {
                            subModulePermissions: {
                                where: {
                                    roleId: roleId,
                                },
                                select: {
                                    canCreate: true,
                                    canRead: true,
                                    canUpdate: true,
                                    canDelete: true,
                                    canManage: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return modules;
}


type ModulePermission = {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
  };
  
  type SubModule = {
    id: string;
    name: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
    subModulePermissions: ModulePermission[];
    subModules: SubModule[];
  };
  
  type Module = {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    modulePermissions: ModulePermission[];
    subModules: SubModule[];
  };

function formatModules(modulesWithPermissions: Module[]): any[] {
    return modulesWithPermissions.map(module => ({
        id: module.id,
        name: module.name,
        canCreate: module.modulePermissions[0]?.canCreate || false,
        canRead: module.modulePermissions[0]?.canRead || false,
        canUpdate: module.modulePermissions[0]?.canUpdate || false,
        canDelete: module.modulePermissions[0]?.canDelete || false,
        canManage: module.modulePermissions[0]?.canManage || false,
        subModules: module.subModules.map(subModule => ({
            id: subModule.id,
            name: subModule.name,
            canCreate: subModule.subModulePermissions[0]?.canCreate || false,
            canRead: subModule.subModulePermissions[0]?.canRead || false,
            canUpdate: subModule.subModulePermissions[0]?.canUpdate || false,
            canDelete: subModule.subModulePermissions[0]?.canDelete || false,
            canManage: subModule.subModulePermissions[0]?.canManage || false,
            subModules: subModule.subModules.length > 0 ? formatSubModules(subModule.subModules) : [], // Recursively format submodules
        }))
    }));
}

// Helper function to format submodules recursively
function formatSubModules(subModules: SubModule[]): any[] {
    return subModules.map(subModule => ({
        id: subModule.id,
        name: subModule.name,
        canCreate: subModule.subModulePermissions[0]?.canCreate || false,
        canRead: subModule.subModulePermissions[0]?.canRead || false,
        canUpdate: subModule.subModulePermissions[0]?.canUpdate || false,
        canDelete: subModule.subModulePermissions[0]?.canDelete || false,
        canManage: subModule.subModulePermissions[0]?.canManage || false,
        subModules: subModule.subModules.length > 0 ? formatSubModules(subModule.subModules) : [],
    }));
}