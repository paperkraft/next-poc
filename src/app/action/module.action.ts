import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface childModule {
    id: string;
    name: string;
    path: string | null;
}
interface IModule {
    id: string;
    name: string;
    path: string | null;
    groupId: string | null;
    children: childModule[];
    // parentId: string | null;
    // groupName: string | null;
    // position: number | null;
    // subModules: IModule[];
}

export async function fetchModules() {
    try {
        const allModules = await prisma.module.findMany({
            include: {
                children: true,
                parent: true,
                group: true,
            },
        });

        // Map for fast lookup
        const moduleMap = new Map<string, any>();

        allModules.forEach((mod) => {
            moduleMap.set(mod.id, {
                id: mod.id,
                name: mod.name,
                path: mod?.path,
                parentId: mod.parentId,
                groupId: mod.groupId,
                groupName: mod.group?.name,
                position: mod.group?.position,
                subModules: [],
            });
        });

        // Nest modules by parentId
        moduleMap.forEach((mod) => {
            if (mod.parentId && moduleMap.has(mod.parentId)) {
                moduleMap.get(mod.parentId)!.subModules.push(mod);
            }
        });

        const rootModules = Array.from(moduleMap.values()).filter((mod) => !mod.parentId);

        return NextResponse.json(
            { success: true, message: 'Success', data: rootModules },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching modules:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching modules' },
            { status: 500 }
        );
    }
}

export async function fetchUniqueModule(id: string) {
    if (!id) {
        return NextResponse.json(
            { success: false, message: "ID is required" },
            { status: 400 }
        );
    }

    try {
        const module = await prisma.module.findUnique({
            where: { id },
            include: {
                children:{
                    select:{
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
            return NextResponse.json(
                { success: false, message: "Module not found" },
                { status: 404 }
            );
        }

        const finalModule = {
            id: module.id,
            name: module.name,
            path: module.path,
            parentId: module.parentId,
            groupId: module.groupId,
            children: module.children,
        }

        // const subModules = await prisma.module.findMany({
        //     where: { parentId: module.id },
        //     include: {
        //         group: true,
        //     },
        // });

        // const formatModule = (mod: any): IModule => ({
        //     id: mod.id,
        //     name: mod.name,
        //     path: mod.path,
        //     groupId: mod.groupId,
        //     parentId: mod.parentId,
        //     groupName: mod.group?.name,
        //     position: mod.group?.position,
        //     subModules: [],
        // });

        // const formattedModule: IModule = {
        //     ...formatModule(module),
        //     children: subModules.map(formatModule),
        // };

        return NextResponse.json(
            { success: true, message: "Success", data: finalModule },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching module:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching module" },
            { status: 500 }
        );
    }
}

export async function fetchModuleByRole(roleId: string) {

    if (!roleId) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const roleModules = await prisma.rolePermission.findMany({
            where: { roleId },
            include: {
                module: {
                    include: {
                        group: true,
                        children: true,
                    },
                },
            }
        });

        const formattedModules = RoleModules(roleModules);

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
    module: {
        id: string;
        name: string;
        path: string | null;
        parentId: string | null;
        group: { name: string } | null;
        children: {
            id: string;
            name: string;
            path: string | null;
            parentId: string | null;
        }[];
    };
}

interface RoleModulesProps {
    id: string;
    name: string;
    path: string | null;
    group: string | undefined;
    parentId: string | null;
    permissions: number;
    subModules: RoleModulesProps[];
}


function RoleModules(data: RolePermissionWithModule[]): RoleModulesProps[] {
    const moduleMap = new Map<string, RoleModulesProps>();

    data.forEach(({ permissionBits, module }) => {
        const baseModule: RoleModulesProps = {
            id: module.id,
            name: module.name,
            path: module.path,
            group: module.group?.name,
            parentId: module.parentId,
            permissions: permissionBits,
            subModules: [],
        };
        moduleMap.set(module.id, baseModule);
    });

    // Nest subModules under their parent
    moduleMap.forEach((mod) => {
        if (mod.parentId && moduleMap.has(mod.parentId)) {
            moduleMap.get(mod.parentId)?.subModules.push(mod);
        }
    });

    // Return only root-level modules
    return Array.from(moduleMap.values()).filter((mod) => !mod.parentId);
}
