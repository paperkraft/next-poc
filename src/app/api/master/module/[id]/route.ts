import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Module {
    id: string;
    name: string;
    parentId: string | null;
    SubModules: Module[] | null;
}

type ModuleWithPermissions = {
    id: string;
    moduleId: string;
    roleId: string;
    submoduleId: string | null;
    permissions: number;
    module: Module;
    submodule: Module | null;
};

type GroupedModule = {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    submodules: GroupedModule[];
};

function groupModulesByParent(modules: ModuleWithPermissions[]): GroupedModule[] {
    const moduleMap: { [key: string]: GroupedModule } = {};

    // Step 1: Initialize the module map with the base module data and set initial permissions
    modules && modules.forEach(item => {
        const module = item.module;
        // Only set the permissions for a module if it's not already in the map
        if (!moduleMap[module.id]) {
            moduleMap[module.id] = {
                id: module.id,
                name: module.name,
                parentId: module.parentId,
                permissions: item.permissions,
                submodules: []
            };
        }
    });

    // Step 2: Add submodules and ensure permissions are handled correctly
    modules && modules.forEach(item => {
        if (item.submodule) {
            const submodule = item.submodule;

            // Ensure the submodule exists in the map and set its permissions
            if (!moduleMap[submodule.id]) {
                moduleMap[submodule.id] = {
                    id: submodule.id,
                    name: submodule.name,
                    parentId: submodule.parentId,
                    permissions: item.permissions,
                    submodules: []
                };
            }

            // Add the submodule to its parent module if not already present
            if (moduleMap[submodule.parentId!]) {
                const parentModule = moduleMap[submodule.parentId!];
                if (!parentModule.submodules.some(s => s.id === submodule.id)) {
                    parentModule.submodules.push(moduleMap[submodule.id]);
                }
            }
        }
    });

    // Step 3: Filter to return only top-level modules (modules with null parentId)
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
                                        },
                                    }
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
                                },
                            }
                        },
                    }
                }
            }
        });

        // Group modules by their parent
        const groupedModules = modulesWithPermissions && groupModulesByParent(modulesWithPermissions);

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