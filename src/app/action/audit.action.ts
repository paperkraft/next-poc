'use server'

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function fetchAuditLogs() {
    try {
        const auditLog = await prisma.auditLog.findMany({
            include:{ user: {
                select:{
                    firstName:true,
                    lastName: true,
                }
            } },
            orderBy:{
                timestamp: 'desc'
            }
        });

        return NextResponse.json(
            { success: true, message: 'Success', data: auditLog },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching auditLog:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching auditLog' },
            { status: 500 }
        );
    }
}