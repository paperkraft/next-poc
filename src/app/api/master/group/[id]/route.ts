import { NextRequest, NextResponse } from 'next/server';

import { logAuditAction } from '@/lib/audit-log';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Group Id is required" },
            { status: 400 }
        );
    }

    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        }

        const data = await prisma.group.update({
            where: { id },
            data: { name }
        });

        await logAuditAction('Update', 'master/groups', { data });

        return NextResponse.json(
            { success: true, message: "Group updated", data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await logAuditAction('Error', 'master/groups', { error: "Error updating group" });
        return NextResponse.json(
            { success: false, message: "Error updating group" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Group Id is required" },
            { status: 400 }
        );
    }

    try {
        const data = await prisma.group.findUnique({
            where: { id: id },
            select: { 
                id: true, 
                name: true 
            }
        });

        if (!data) {
            return NextResponse.json(
                { success: false, message: 'Not Found', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Success', data },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error fetching group" },
            { status: 500 }
        );
    }
}