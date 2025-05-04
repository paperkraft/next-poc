import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function fetchGroups() {
    try {
        const groups = await prisma.group.findMany({
            select: { id: true, name: true }
        });

        // const formated = groups.map((item: IGroup) => ({ label: item.name, value: item.id }));

        return NextResponse.json(
            { success: true, message: 'Success', data: groups },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching groups:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching groups' },
            { status: 500 }
        );
    }
}

export async function fetchUniqueGroup(id: string) {
    try {
        const group = await prisma.group.findUnique({
            where: { id: id },
            select: { id: true, name: true },
        });

        if(!group){
            return NextResponse.json(
                { success: false, message: 'No Record', data: null },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: 'Success', data: group },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching group:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching group' },
            { status: 500 }
        );
    }
}