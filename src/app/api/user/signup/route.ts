import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { makePassword } from '@/utils/password';

export async function POST(request: Request) {
    const { email, password, ...rest } = await request.json();

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR:[
                    { email: email },
                ]
             }
        });
    
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const roleId = await prisma.role.findFirst({
            where:{ name: "guest" },
            select:{ id: true }
        })

        const hashedPassword = await makePassword(password)
        
        await prisma.user.create({
            data: { 
                ...rest, 
                email, 
                password: hashedPassword, 
                name: `${rest.firstName} ${rest.lastName}`, 
                roleId: roleId?.id,
            }
        });
    
        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
