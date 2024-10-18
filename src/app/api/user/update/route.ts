import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { username, firstName, lastName, email } = await request.json();
    try {
        const user = await prisma.user.findUnique({where: { email }});

        if (!user) {
            return NextResponse.json({ message: 'User doesnot exists' }, { status: 500 });
        }

        await prisma.user.update({
            where:{ email },
            data: {
                username,
                email,
                firstName,
                lastName,
                name: `${firstName} ${lastName}`
            }
        });

        return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({...error});
    }
}