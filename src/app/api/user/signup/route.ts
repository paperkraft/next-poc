import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const { firstName, lastName, email, password, phone } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    })

    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await prisma.user.create({
        data: {
            name: firstName +' '+ lastName,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        }
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}
