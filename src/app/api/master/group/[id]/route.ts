import { fetchUniqueGroup } from "@/app/action/group.action";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Role ID is required" },
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

        return NextResponse.json(
            { success: true, message: "Group updated", data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
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
            { success: false, message: "Role ID is required" },
            { status: 400 }
        );
    }
    try {
        const res = await fetchUniqueGroup(id).then((d)=>d.json());
        return NextResponse.json(
            { success: true, message: "Group", data: res.data },
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