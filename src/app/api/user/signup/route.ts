import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const { username, email, password } = await request.json();

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR:[
                    { email: email },
                    { username: username }
                ]
             }
        });
    
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert the new user
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
    
        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
