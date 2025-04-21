import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return NextResponse.json(
            { success: true, data: roles },
            { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error fetching roles' },
            { status: 500 });
    }
}

export async function POST(request: Request) {
    const { name } = await request.json();
    try {
        const data = await prisma.role.create({
            data: { name }
        });
        
        await logAuditAction('Create', 'master/role', { data });

        return NextResponse.json(
            { success: true, message: 'Role created', data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await logAuditAction('Error', 'master/role', { error: 'Failed to create role' });
        return NextResponse.json(
            { success: false, message: 'Error in creating role' },
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request) {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json(
            { success: false, message: "Role Id is required" },
            { status: 400 }
        );
    }

    try {
        // Check if any role is assigned to a user
        // If so, prevent deletion and return a message
        const rolesWithUser = await prisma.role.findMany({
            where: {
                id: { in: ids },
                users: { some: {} },  // Check if the role has any associated users
            }
        });

        if (rolesWithUser.length > 0) {
            return NextResponse.json(
                { success: false, message: "Cannot delete role, it's assigned to user" },
                { status: 400 }
            );
        }

        const existingRecords = await prisma.role.findMany({
            where: { id: { in: ids } }
        });

        if (existingRecords.length !== ids.length) {
            return NextResponse.json({ success: false, message: 'Some records were not found' }, { status: 404 });
        }

        const data = await prisma.role.deleteMany({
            where: { id: { in: ids } },
        });

        await logAuditAction('Delete', 'master/role', { data: existingRecords });

        revalidatePath('/master/role');

        return NextResponse.json(
            { success: true, message: "Role deleted", data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await logAuditAction('Error', 'master/role', { error: 'Failed to delete role' });
        return NextResponse.json(
            { success: false, message: "Error deleting role" },
            { status: 500 }
        );
    }
}