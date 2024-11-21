import { IModule } from "@/app/master/module/ModuleInterface";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function formatModule(module: any): IModule {
    return {
      id: module.id,
      name: module.name,
      parentId: module?.parentId,
      permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
      submodules: (module.SubModules || []).map((submodule: any) => formatModule(submodule)),
    };
  }

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    console.log('roleId', id);

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const modulesWithSubmodules = await prisma.module.findMany({
            where: {
                ModulePermissions: {
                    some: {
                        roleId:id
                    },
                },
            },
            include: {
                permissions: true,
                SubModules: {
                    include: {
                        permissions: true,
                        SubModules: {
                            include: {
                                permissions: true,
                                SubModules: {
                                    include: {
                                        permissions: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!modulesWithSubmodules) {
            return NextResponse.json(
                { success: false, message: "Module not found" },
                { status: 404 }
            );
        }

        const formattedModules = modulesWithSubmodules.map((module) => formatModule(module));
        const submoduleIds = new Set(formattedModules.flatMap((module) => module.submodules.map((submodule) => submodule.id)));
        const finalModules = formattedModules.filter((module) => !submoduleIds.has(module.id));

        return NextResponse.json(
            { success: true, data: finalModules },
            { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error fetching modules' },
            { status: 500 });
    }

}