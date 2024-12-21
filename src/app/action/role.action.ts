'use server'

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function fetchRoles() {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                permissions: true,
            },
        });
        
        return NextResponse.json(
            { success: true, message: 'Success', data: roles },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching roles' },
            { status: 500 }
        );
    }
}


export async function fetchUniqueRoles(id: string) {
    try {
        const role = await prisma.role.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                permissions: true,
            },
        });

        return NextResponse.json(
            { success: true, message: 'Success', data: role },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching role:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching role' },
            { status: 500 }
        );
    }
}