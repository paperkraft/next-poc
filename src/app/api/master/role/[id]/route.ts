import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const role = await prisma.role.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                permissions: true,
            }
        });
        if (!role) {
            return NextResponse.json(
                { success: false, message: "Role not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, data: role }, 
            { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error fetching role' }, 
            { status: 500 });
    }
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const { name, permissions } = await request.json();

        if (!name || permissions === undefined) {
            return NextResponse.json(
                { success: false, message: "Name and permissions are required" },
                { status: 400 }
            );
        }

        const updatedRole = await prisma.role.update({
            where: { id },
            data: { name, permissions }
        });
        
        await logAuditAction('Update', 'master/role', { data:updatedRole });
        return NextResponse.json(
            { success: true, message: "Role updated", data: updatedRole },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await logAuditAction('Error', 'master/role', { error: 'Failed to update role' });
        return NextResponse.json(
            { success: false, message: "Error updating role" },
            { status: 500 }
        );
    }
}
