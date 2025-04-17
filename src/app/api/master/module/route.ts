import { fetchModules } from "@/app/action/module.action";
import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return fetchModules();
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

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { name, path, parentId, groupId } = body;

//   try {
//     const data = await prisma.module.create({
//       data: {
//         name,
//         path: path === '#' ? undefined : path,
//         parentId: parentId ? parentId : undefined,
//         groupId: parentId ? undefined : groupId
//       }
//     });

//     await logAuditAction('Create', 'master/module', { data });
//     return NextResponse.json(
//       { success: true, message: 'Module created', data },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error(error)
//     await logAuditAction('Error', 'master/module', { error: 'Failed to create module' });
//     return NextResponse.json({ success: false, message: 'Failed to create module' }, { status: 500 });
//   }
// }

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    if (!id) {
      return NextResponse.json({ success: false, message: "Module ID is required" }, { status: 400 });
    }
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const created = await createModuleRecursive(body);

    return NextResponse.json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Failed to create module' }, { status: 500 });
  }
}

async function createModuleRecursive(data: any, parentId?: string, depth: number = 0): Promise<any> {
  const { name, path, groupId, children = [] } = data;

  if (depth > 2) {
    throw new Error(`Cannot create module deeper than 2 levels (got level ${depth}).`);
  }

  try {
    console.log('Creating module:', { name, path, parentId });

    const module = await prisma.module.create({
      data: {
        name,
        path,
        groupId,
        parentId,
      },
    });

    const createdChildren = [];

    for (const child of children) {
      try {
        const createdChild = await createModuleRecursive(child, module.id, depth + 1);
        createdChildren.push(createdChild);
      } catch (childErr) {
        console.error('Failed to create child module:', childErr);
      }
    }

    return {
      ...module,
      children: createdChildren,
    };
  } catch (err) {
    console.error('Failed to create module:', { name, path, parentId, error: err });
    throw err; // Let the parent handle the failure if needed
  }
}

