import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                permissions: true,
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
    const { name, permissions } = await request.json();
    try {
        const data = await prisma.role.create({
            data: { name, permissions }
        })
        return NextResponse.json(
            { success: true, message: 'Role created', data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error in creating role' }, 
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }

    try {
        const deletedRole = await prisma.role.delete({
            where: { id },
        });

        return NextResponse.json(
            { success: true, message: "Role deleted", data: deletedRole },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error deleting role" },
            { status: 500 }
        );
    }
}