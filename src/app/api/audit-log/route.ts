import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, message: 'Invalid request payload' }, { status: 400 });
    }

    try {
        const existingRecords = await prisma.auditLog.findMany({
            where: { id: { in: ids } },
            select: { id: true, action: true },
        });

        if (existingRecords.length !== ids.length) {
            return NextResponse.json({ success: false, message: 'Some records were not found' }, { status: 404 });
        }

        const result = await prisma.auditLog.deleteMany({
            where: { id: { in: ids } },
        });

        await logAuditAction('Delete', 'audit-log', { data: existingRecords });
        return NextResponse.json({ success: true, message: 'Success', data: result.count }, { status: 200 });
    } catch (error: any) {
        await logAuditAction('Error', 'audit-log', { error: "Error deleting log" });
        return NextResponse.json({ ...error });
    }
}