import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const { email, password, ...rest } = await request.json();

    console.log('rest', rest);
    console.log('email', email);
    console.log('password', password);
    
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
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert the new user
        await prisma.user.create({
            data: { email, password: hashedPassword, ...rest, name: `${rest.firstName} ${rest.lastName}` }
        });
    
        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
