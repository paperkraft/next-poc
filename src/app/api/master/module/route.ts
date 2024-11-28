import { getModulesWithSubmodules } from "@/app/master/module/page";
import prisma from "@/lib/prisma";
import { group } from "console";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        const data = await getModulesWithSubmodules()
        return NextResponse.json(
            { success: true, message: 'Success', data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(req:Request) {
    const data = await req.json();
    const hasSubmodule = data && data?.subModules?.length;

    const updateSubmodules = (subModule: any) => {
        return subModule.map((subModule:any) => ({
          where: { id: subModule.id },
          data: {
            name: subModule.name,
            subModules: subModule.subModules.length ? {
              update: updateSubmodules(subModule.subModules)
            } : undefined,
          },
        }));
    };

    const final = hasSubmodule 
      ? {
        name: data.name,
        subModules: {
          update: updateSubmodules(data.subModules),
        }
      } 
      : {
        name: data.name,
        group: data.group
      }

    if(!data?.id){
        return NextResponse.json(
            { success: false, message: "Module ID is required" },
            { status: 400 }
        );
    }

    try {
        await prisma.module.update({
            where:{id: data.id},
            data: final
        });
        return NextResponse.json({ success: true, message: 'Success' }, { status: 200 });
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 });
    }
}

export async function POST(req:Request) {
    const {name, parentId, groupId} = await req.json();
    try {
        const data = await prisma.module.create({
            data:{
                name: name,
                parentId: parentId ? parentId : null,
                groupId: parentId ? null : groupId
            }
        });
        return NextResponse.json(
            { success: true, message: 'Module created', data },
            { status: 200 }
        );
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to create' }, { status: 500 });
    }
}

export async function DELETE(req:Request) {
    const { id } = await req.json();
    try {
        if(!id){
            return NextResponse.json({ success: false, message: "Module ID is required" }, { status: 400 });
        }
        await prisma.$transaction([
            prisma.modulePermission.deleteMany({
              where: { moduleId: id },
            }),
            prisma.module.delete({
              where: { id: id },
            }),
        ]);

        return NextResponse.json({ success: true, message: 'Module deleted' }, { status: 200 });
          
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to delete module' }, { status: 500 });
    }
}