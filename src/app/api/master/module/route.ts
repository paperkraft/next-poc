import { fetchModules } from "@/app/action/module.action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = await fetchModules();
  return NextResponse.json({ success: res.success, message: res.message, data: res.data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await createModuleRecursive(body);

    return NextResponse.json({ success: true, message: "Module created successfully", data: created });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Failed to create module' }, { status: 500 });
  }
}

async function createModuleRecursive(data: any, parentId?: number, depth: number = 0): Promise<any> {
  const { name, path, groupId, children = [] } = data;

  if (depth > 2) {
    throw new Error(`Cannot create module deeper than 2 levels (got level ${depth}).`);
  }

  try {
    const module = await prisma.menuItem.create({
      data: {
        name,
        path,
        groupId: +groupId,
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

export async function DELETE(request: Request) {
  const { ids } = await request.json();

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json(
      { success: false, message: "Module Id is required" },
      { status: 400 }
    );
  }

  try {

    // Step 1: Check if any module has children
    // const modulesWithChildren = await prisma.menuItem.findMany({
    //   where: {
    //     id: { in: ids },
    //     children: { some: { isDeleted: false } }, // Only check active children
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //   },
    // });

    // if (modulesWithChildren.length > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Cannot delete modules that have active child modules.",
    //       modules: modulesWithChildren.map((m) => m.name),
    //     },
    //     { status: 400 }
    //   );
    // }

    // Step 2: Check if any module is assigned to roles
    const assigned = await prisma.rolePermission.findMany({
      where: {
        menuId: { in: ids },
      },
      select: {
        menuId: true,
        menus: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    if (assigned.length > 0) {
      const grouped = assigned.reduce<Record<string, string[]>>((acc, curr) => {
        const moduleName = curr.menus.name || 'Unknown';
        const roleName = curr.role.name || 'Unknown';
        if (!acc[moduleName]) acc[moduleName] = [];
        acc[moduleName].push(roleName);
        return acc;
      }, {});

      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete assigned modules.",
          assigned: grouped,
        },
        { status: 400 }
      );
    }

    // Step 3: Soft delete (mark as isDeleted: true)
    const data = await prisma.menuItem.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isActive: true,
      },
    });

    revalidatePath('/master/module');

    return NextResponse.json(
      { success: true, message: "Module deleted", data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error deleting module" },
      { status: 500 }
    );
  }
}