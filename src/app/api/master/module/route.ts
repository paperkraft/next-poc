import { fetchModules } from "@/app/action/module.action";
import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  return fetchModules();
  // try {
  //   const result = await fetchModules().then((d) => d.json());
  //   return NextResponse.json(
  //     { success: true, message: 'Success', data: result.data },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   console.error(error)
  //   return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  // }
}

export async function PUT(req: Request) {
  const data = await req.json();
  const hasSubmodule = data && data?.subModules?.length;

  const updateSubmodules = (subModule: any) => {
    return subModule.map((subModule: any) => ({
      where: { id: subModule.id },
      data: {
        name: subModule.name,
        path: subModule.path,
        subModules: subModule.subModules.length ? {
          update: updateSubmodules(subModule.subModules)
        } : undefined,
      },
    }));
  };

  const final = hasSubmodule
    ? {
      name: data.name,
      path: data.path,
      groupId: data.group,
      subModules: {
        update: updateSubmodules(data.subModules),
      }
    }
    : {
      name: data.name,
      path: data.path,
      groupId: data.group
    }

  if (!data?.id) {
    return NextResponse.json(
      { success: false, message: "Module ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.module.update({
      where: { id: data.id },
      data: final
    });
    await logAuditAction('Update', 'master/module', { data: final });
    return NextResponse.json({ success: true, message: 'Success' }, { status: 200 });

  } catch (error) {
    console.error(error)
    await logAuditAction('Error', 'master/module', { error: 'Failed to update module' });
    return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, path, parentId, groupId } = await req.json();
  try {
    const data = await prisma.module.create({
      data: {
        name: name,
        path: path ?? '#',
        parentId: parentId ? parentId : undefined,
        groupId: parentId ? undefined : groupId
      }
    });

    await logAuditAction('Create', 'master/module', { data });
    return NextResponse.json(
      { success: true, message: 'Module created', data },
      { status: 200 }
    );

  } catch (error) {
    console.error(error)
    await logAuditAction('Error', 'master/module', { error: 'Failed to create module' });
    return NextResponse.json({ success: false, message: 'Failed to create module' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    if (!id) {
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

    await logAuditAction('Delete', 'master/module', { data: id });
    return NextResponse.json({ success: true, message: 'Module deleted' }, { status: 200 });

  } catch (error) {
    console.error(error);
    await logAuditAction('Error', 'master/module', { error: 'Failed to delete module' });
    return NextResponse.json({ success: false, message: 'Failed to delete module' }, { status: 500 });
  }
}