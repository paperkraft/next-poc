import { auth } from "@/auth";
import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { AuditAction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { success: false, message: "User session not found", data: [] },
                { status: 400 }
            );
        }

        const { tenantId } = session.user;

        const data = await prisma.menuGroup.findMany({
            where: tenantId ? { tenantId, isActive: true } : undefined,
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(
            { success: true, message: 'Success', data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
  const session = await auth();
  const { name } = await request.json();

  try {
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Group name is required' },
        { status: 400 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { success: false, message: "User session not found", data: [] },
        { status: 400 }
      );
    }

    const { tenantId } = session.user;

    const exist = await prisma.menuGroup.findFirst({
      where: { name, tenantId }
    });

    if (exist) {
      return NextResponse.json(
        { success: false, message: 'Group already exist', data: exist },
        { status: 200 }
      );
    }

    const data = await prisma.menuGroup.create({
      data: { name, tenantId }
    });

    await logAuditAction({
      action: AuditAction.CREATE,
      entity: 'master/groups',
      details: { data }
    });

    return NextResponse.json(
      { success: true, message: 'Group created', data },
      { status: 200 }
    );

  } catch (error) {
    await logAuditAction({
      action: AuditAction.ERROR,
      entity: 'master/groups',
      details: { error: "Error creating group" }
    });
    return NextResponse.json(
      { success: false, message: 'Error in creating group' },
      { status: 400 }
    );
  }
}


export async function DELETE(request: Request) {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json(
            { success: false, message: "Id is required" },
            { status: 400 }
        );
    }

    try {
        // Check if any group is assigned to a module
        const groupsWithModules = await prisma.menuGroup.findMany({
            where: {
                id: { in: ids },
                menus: { some: {} },  // Check if the group has any associated modules
            }
        });

        if (groupsWithModules.length > 0) {
            return NextResponse.json(
                { success: false, message: "Cannot delete group, it's assigned to one or more modules" },
                { status: 400 }
            );
        }

        const existingRecords = await prisma.menuGroup.findMany({
            where: { id: { in: ids } }
        });

        if (existingRecords.length !== ids.length) {
            return NextResponse.json({ success: false, message: 'Some records were not found' }, { status: 404 });
        }

        const record = await prisma.menuGroup.deleteMany({
            where: { id: { in: ids } },
        });

        await logAuditAction({
            action: AuditAction.DELETE,
            entity: 'master/groups',
            details: { data: existingRecords }
        });

        revalidatePath('/master/groups');

        return NextResponse.json(
            { success: true, message: "Group deleted", data: record },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await logAuditAction({
            action: AuditAction.ERROR,
            entity: 'master/groups',
            details: { error: "Error deleting group" }
        });
        return NextResponse.json(
            { success: false, message: "Error deleting group" },
            { status: 500 }
        );
    }
}