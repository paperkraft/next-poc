import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { id } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select:{
                id:true,
                email:true,
                lastName:true,
                firstName:true,
                username:true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User doesnot exists' }, { status: 500 });
        }

        return NextResponse.json({ ...user },{ status: 200 });
    } catch (error:any) {
        return NextResponse.json({ ...error });
    }
}