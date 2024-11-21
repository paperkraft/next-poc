import { IModule } from "@/app/master/module/ModuleInterface";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


interface GroupedModule {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    submodules: GroupedModule[];
}
// Recursive function to group modules and submodules
const groupModules = (modulesWithPermissions: any[], parentId: string | null): GroupedModule[] => {
    const uniqueModules = new Map<string, GroupedModule>();

    // Process the modules and submodules by their parentId
    modulesWithPermissions.forEach(permission => {
        // Ensure the 'permissions' property is defined (defaults to 0 if undefined)
        const modulePermissions = permission.permissions ?? 0;

        if (permission.module.parentId === parentId) {
            // Check if the module already exists in the Map
            let module = uniqueModules.get(permission.module.id);
            if (!module) {
                module = {
                    id: permission.module.id,
                    name: permission.module.name,
                    parentId: permission.module.parentId,
                    permissions: modulePermissions,  // Initialize with default permissions
                    submodules: []  // Initialize submodules as an empty array
                };
                uniqueModules.set(permission.module.id, module);
            } else {
                // If the module already exists, aggregate permissions (combine permissions if needed)
                module.permissions |= modulePermissions;  // Combine permissions with bitwise OR
            }
        }

        // Handle submodules (if any)
        if (permission.submodule && permission.submodule.parentId === parentId) {
            // Ensure the 'permissions' property for submodule is defined
            const submodulePermissions = permission.permissions ?? 0;
            let submodule = uniqueModules.get(permission.submodule.id);
            if (!submodule) {
                submodule = {
                    id: permission.submodule.id,
                    name: permission.submodule.name,
                    parentId: permission.submodule.parentId,
                    permissions: submodulePermissions,  // Initialize with default permissions
                    submodules: []
                };
                uniqueModules.set(permission.submodule.id, submodule);
            } else {
                // Aggregate permissions for submodules (combine permissions)
                submodule.permissions |= submodulePermissions;
            }
        }
    });

    // After collecting unique modules, we now assign submodules recursively
    uniqueModules.forEach(module => {
        // Find submodules recursively by parentId
        const submodules = groupModules(modulesWithPermissions, module.id);

        // If submodules are found, assign them
        if (submodules.length > 0) {
            module.submodules = submodules;
        }
    });

    return Array.from(uniqueModules.values());
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
        const modulesWithPermissions = await prisma.modulePermissions.findMany({
            where: {
                roleId: roleId,
            },
            select: {
                module: {
                    select: {
                        id: true,
                        name: true,
                        parentId: true,
                    }
                },
                submodule: {
                    select: {
                        id: true,
                        name: true,
                        parentId: true,
                    }
                },
                permissions: true,
            },
        });

        if (!modulesWithPermissions) {
            return NextResponse.json(
                { success: false, message: "Module not found" },
                { status: 404 }
            );
        }

        const groupedModules: GroupedModule[] = groupModules(modulesWithPermissions, null);

        return NextResponse.json(
            { success: true, data: groupedModules },
            { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error fetching modules' },
            { status: 500 });
    }

}