import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ModuleWithPermissions = {
    id: string;
    moduleId: string;
    roleId: string;
    submoduleId: string | null;
    permissions: number;
    module: {
        id: string;
        name: string;
        parentId: string | null;
        SubModules: {
            id: string;
            name: string;
            parentId: string;
            SubModules: any[];
        }[];
    };
    submodule: {
        id: string;
        name: string;
        parentId: string;
        SubModules: any[];
    } | null;
};

type GroupedModule = {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    submodules: GroupedModule[];
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
                permissions: item.permissions, // Assign permissions from module
                submodules: []
            };
        }
    });

    // Assign submodules and their permissions
    modules.forEach(item => {
        if (item.submodule) {
            const submodule = item.submodule;

            // Ensure the submodule is correctly added to the module map
            if (!moduleMap[submodule.id]) {
                moduleMap[submodule.id] = {
                    id: submodule.id,
                    name: submodule.name,
                    parentId: submodule.parentId,
                    permissions: item.permissions, // Assign permissions from the submodule
                    submodules: submodule.SubModules.map((sub: any) => ({
                        id: sub.id,
                        name: sub.name,
                        parentId: sub.parentId,
                        permissions: item.permissions, // Assign permissions recursively for submodules
                        submodules: [] // Empty submodules initially
                    }))
                };
            }

            // Add the submodule to its parent module
            if (moduleMap[submodule.parentId!]) {
                moduleMap[submodule.parentId!].submodules.push(moduleMap[submodule.id]);
            }
        }
    });

    // Ensure the module permissions are correctly aggregated from submodules
    Object.values(moduleMap).forEach(module => {
        if (module.submodules.length > 0) {
            module.permissions = Math.max(
                module.permissions,
                ...module.submodules.map(sub => sub.permissions)
            );
        }
    });

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
                        SubModules: {
                            where: {
                                SubModulePermissions: {
                                    some: {
                                        roleId
                                    }
                                }
                            },
                            include: {
                                SubModules: {
                                    where: {
                                        SubModulePermissions: {
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
                submodule: {
                    include: {
                        SubModules: {
                            where: {
                                SubModulePermissions: {
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