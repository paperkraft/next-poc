import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ModuleWithPermissions = {
    id: string;
    moduleId: string;
    roleId: string;
    subModuleId: string | null;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManage: boolean;
    module: {
        id: string;
        name: string;
        parentId: string | null;
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
        canManage: boolean;
        subModules: {
            id: string;
            name: string;
            parentId: string;
            canCreate: boolean;
            canRead: boolean;
            canUpdate: boolean;
            canDelete: boolean;
            canManage: boolean;
            subModules: any[];
        }[];
    };
    subModule: {
        id: string;
        name: string;
        parentId: string;
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
        canManage: boolean;
        subModules: any[];
    } | null;
};

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

// Function to group modules by parent
function groupModulesByParent(modules: ModuleWithPermissions[]): GroupedModule[] {
    const moduleMap: { [key: string]: GroupedModule } = {};

    // Initialize the module map with the base module data
    modules.forEach(item => {
        const module = item.module;
        if (!moduleMap[module.id]) {
            moduleMap[module.id] = {
                id: module.id,
                name: module.name,
                parentId: module.parentId,
                // permissions: item.permissions, // Assign permissions from module
                canCreate: item.canCreate,
                canRead: item.canRead,
                canUpdate: item.canUpdate,
                canDelete: item.canDelete,
                canManage: item.canManage,

                subModules: []
            };
        }
    });

    // Assign submodules and their permissions
    modules.forEach(item => {
        if (item.subModule) {
            const subModule = item.subModule;

            // Ensure the submodule is correctly added to the module map
            if (!moduleMap[subModule.id]) {
                moduleMap[subModule.id] = {
                    id: subModule.id,
                    name: subModule.name,
                    parentId: subModule.parentId,
                    // permissions: item.permissions,
                    canCreate: item.canCreate,
                    canRead: item.canRead,
                    canUpdate: item.canUpdate,
                    canDelete: item.canDelete,
                    canManage: item.canManage,

                    subModules: subModule.subModules.map((sub: any) => ({
                        id: sub.id,
                        name: sub.name,
                        parentId: sub.parentId,
                        // permissions: item.permissions, // Assign permissions recursively for submodules
                        canCreate: item.canCreate,
                        canRead: item.canRead,
                        canUpdate: item.canUpdate,
                        canDelete: item.canDelete,
                        canManage: item.canManage,

                        subModules: [] // Empty submodules initially
                    }))
                };
            }

            // Add the submodule to its parent module
            if (moduleMap[subModule.parentId!]) {
                moduleMap[subModule.parentId!].subModules.push(moduleMap[subModule.id]);
            }
        }
    });

    // Ensure the module permissions are correctly aggregated from submodules
    // Object.values(moduleMap).forEach(module => {
    //     if (module.subModules.length > 0) {
    //         module.permissions = Math.max(
    //             module.permissions,
    //             ...module.subModules.map(sub => sub.permissions)
    //         );
    //     }
    // });

    // Return the top-level modules (modules with null parentId)
    return Object.values(moduleMap).filter(module => module.parentId === null);
}

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
        const modulesWithPermissions = await prisma.modulePermissions.findMany({
            where: {
                roleId: roleId,
            },
            include: {
                module: {
                    include: {
                        subModules: {
                            where: {
                                subModulePermissions: {
                                    some: {
                                        roleId
                                    }
                                }
                            },
                            include: {
                                subModules: {
                                    where: {
                                        subModulePermissions: {
                                            some: {
                                                roleId
                                            }
                                        }
                                    },
                                },
                            }
                        }
                    }
                },
                subModule: {
                    include: {
                        subModules: {
                            where: {
                                subModulePermissions: {
                                    some: {
                                        roleId
                                    }
                                }
                            },
                        },
                    }
                }
            }
        });

        if (!modulesWithPermissions) {
            return NextResponse.json(
                { success: false, message: "Module not found" },
                { status: 404 }
            );
        }

        const modules = await prisma.module.findMany({
            where: {
              parentId: null, // Only fetch top-level modules (parent modules)
            },
            select: {
              id: true,
              name: true,
              parentId: true,
              modulePermissions: {
                where: {
                  roleId: roleId, // Filter permissions based on the roleId
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
                select: {
                  id: true,
                  name: true,
                  parentId: true,
                  modulePermissions: {
                    where: {
                      roleId: roleId, // Filter permissions based on roleId for submodules
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
                    select: {
                      id: true,
                      name: true,
                      parentId: true,
                      modulePermissions: {
                        where: {
                          roleId: roleId, // Filter permissions based on roleId for nested submodules
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


        const data = formatModules(modules);
        // console.log('MM-',JSON.stringify(data, null, 2));
        
        // Group modules by their parent
        const groupedModules = groupModulesByParent(modulesWithPermissions as any);

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




// Helper function to format the data into GroupedModule structure
function formatModules(modules: any[]): GroupedModule[] {
    return modules && modules.map((module) => {
      return {
        id: module.id,
        name: module.name,
        parentId: module.parentId,
        canCreate: module.modulePermissions.length > 0 ? module.modulePermissions[0].canCreate : false,
        canRead: module.modulePermissions.length > 0 ? module.modulePermissions[0].canRead : false,
        canUpdate: module.modulePermissions.length > 0 ? module.modulePermissions[0].canUpdate : false,
        canDelete: module.modulePermissions.length > 0 ? module.modulePermissions[0].canDelete : false,
        canManage: module.modulePermissions.length > 0 ? module.modulePermissions[0].canManage : false,
        subModules: formatSubModules(module.subModules),
      };
    });
  }
  
  // Helper function to format submodules
  function formatSubModules(subModules: any[]): GroupedModule[] {
    return subModules && subModules.map((submodule) => {
      return {
        id: submodule.id,
        name: submodule.name,
        parentId: submodule.parentId,
        canCreate: submodule.modulePermissions.length > 0 ? submodule.modulePermissions[0].canCreate : false,
        canRead: submodule.modulePermissions.length > 0 ? submodule.modulePermissions[0].canRead : false,
        canUpdate: submodule.modulePermissions.length > 0 ? submodule.modulePermissions[0].canUpdate : false,
        canDelete: submodule.modulePermissions.length > 0 ? submodule.modulePermissions[0].canDelete : false,
        canManage: submodule.modulePermissions.length > 0 ? submodule.modulePermissions[0].canManage : false,
        subModules: formatSubModules(submodule.subModules), // Recursively fetch submodules
      };
    });
  }