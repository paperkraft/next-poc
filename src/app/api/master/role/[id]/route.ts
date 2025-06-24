import { NextRequest, NextResponse } from 'next/server';

import { logAuditAction } from '@/lib/audit-log';
import prisma from '@/lib/prisma';
import { AuditAction } from '@prisma/client';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role Id is required" },
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

        const data = await prisma.role.update({
            where: { id },
            data: { name }
        });

        await logAuditAction(AuditAction.UPDATE, 'master/role', { data: data });

        return NextResponse.json(
            { success: true, message: "Role updated", data: data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await logAuditAction(AuditAction.ERROR, 'master/role', { error: 'Failed to update role' });
        return NextResponse.json(
            { success: false, message: "Error updating role" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role Id is required" },
            { status: 400 }
        );
    }

    try {
        const data = await prisma.role.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true
            }
        });

        if (!data) {
            return NextResponse.json(
                { success: false, message: "Not found", data: null },
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
            { success: false, message: 'Error fetching role' },
            { status: 500 }
        );
    }
}