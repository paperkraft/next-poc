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
    modules.forEach(item => {
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
    modules.forEach(item => {
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

            // if (moduleMap[submodule.parentId!]) {
            //     const parentModule = moduleMap[submodule.parentId!];
            //     if (!parentModule.submodules.some(s => s.id === submodule.id)) {
            //         parentModule.submodules.push(moduleMap[submodule.id]);
            //     }
            // }

            const parentModule = moduleMap[submodule.parentId!];
            if (!parentModule?.submodules!.some(s => s.id === submodule.id)) {
                parentModule?.submodules!.push(moduleMap[submodule.id]);
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
                submoduleId: true,
            },
        });

        console.log("userModulesGrouped", JSON.stringify(userModulesGrouped, null, 2))
        const dd = formatToParentChild(userModulesGrouped)

        // Group modules by their parent
        const groupedModules = modulesWithPermissions && groupModulesByParent(modulesWithPermissions);

        // Respond with the grouped modules
        return NextResponse.json(
            { success: true, data: groupedModules, ext: dd },
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



interface OutputFormat {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    submodules: OutputFormat[] | null;
}

// Function to transform the input into a parent-child hierarchical format
function formatToParentChild(input: any[]): OutputFormat[] {
    // A map to store all modules by their id
    const moduleMap: { [key: string]: OutputFormat } = {};

    // Step 1: Create a module map where each module/submodule is keyed by id
    input.forEach((item) => {
        const module = item.module;
        const submodule = item.submodule;

        if (!moduleMap[module.id]) {
            moduleMap[module.id] = {
                id: module.id,
                name: module.name,
                parentId: module.parentId,
                permissions: item.permissions,
                submodules: []
            };
        }

        // Handle the submodule if it exists and map it
        if (submodule) {
            if (!moduleMap[submodule.submoduleId]) {
                moduleMap[submodule.submoduleId] = {
                    id: submodule.submoduleId,
                    name: submodule.name,
                    parentId: submodule.parentId,
                    permissions: item.permissions,
                    submodules: []
                };
            }

            // Find the parent module and add the submodule under it
            const parentModule = moduleMap[submodule.parentId!];
            if (parentModule) {
                // Ensure submodule is only added once
                if (!parentModule.submodules!.some(sub => sub.id === submodule.submoduleId)) {
                    parentModule.submodules!.push(moduleMap[submodule.submoduleId]);
                }
            }
        }
    });

    // Step 2: Extract only the top-level modules (those with no parentId)
    // return Object.values(moduleMap).filter(module => module.parentId === null);

    // Step 2: Propagate permissions to submodules
    const propagatePermissions = (module: OutputFormat) => {
        if (module.submodules) {
            module.submodules.forEach(submodule => {
                // If the submodule doesn't have permissions, inherit from the parent
                if (submodule.permissions === 0) {
                    submodule.permissions = module.permissions;
                }
                propagatePermissions(submodule);  // Recursively apply to nested submodules
            });
        }
    };

    // Step 3: Filter out top-level modules (those with no parentId)
    const topLevelModules = Object.values(moduleMap).filter(module => module.parentId === null);

    // Step 4: Propagate permissions and return the final result
    topLevelModules.forEach(module => {
        propagatePermissions(module);  // Apply permission propagation for each top-level module
    });

    return topLevelModules;
}
