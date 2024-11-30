import { IModule } from "@/app/master/module/ModuleInterface";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

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
                group: true,
                subModules: {
                    include: {
                        subModules: {
                            include: {
                                subModules: true,
                            },
                        },
                    },
                },
            },
        });

        const finalModules = module && formatModule(module);

        return NextResponse.json(
            { success: true, message: 'Success', data: finalModules },
            { status: 200 }
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
    }
}

function formatModule(module: any): IModule {
    return {
        id: module.id,
        name: module.name,
        group: module.group,
        parentId: module?.parentId,
        permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
        subModules: (module.subModules || []).map((subModule: any) => formatModule(subModule)),
    };
}