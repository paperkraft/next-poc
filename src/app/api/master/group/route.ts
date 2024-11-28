import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const data = await prisma.group.findMany({
            select:{
                id:true,
                name:true
            }
        });
        return NextResponse.json(
            { success: true, message: 'Success', data },
            { status: 200 }
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { name } = await request.json();
    try {

        const exist = await prisma.group.findFirst({
            where:{ name }
        });

        if(exist){
            return NextResponse.json(
                { success: false, message: 'Group already exist', data:exist },
                { status: 200 }
            );
        }

        const data = await prisma.group.create({
            data: { name }
        })
        return NextResponse.json(
            { success: true, message: 'Group created', data },
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
            { success: false, message: "Id is required" },
            { status: 400 }
        );
    }

    try {
        const record = await prisma.group.delete({
            where: { id },
        });

        return NextResponse.json(
            { success: true, message: "Group deleted", data: record },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error deleting group" },
            { status: 500 }
        );
    }
}