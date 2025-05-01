import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const { endpoint } = await request.json();
    const session = await auth();
    const userId: string | undefined = session?.user?.id;

    if (!endpoint) {
        return NextResponse.json(
            { success: false, message: "Endpoint is required" },
            { status: 400 }
        );
    }

    if (!userId) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const data = await prisma.subscription.findUnique({
            where: { userId, endpoint },
            select: {
                topics: true
            }
        });

        if (!data) {
            return NextResponse.json(
                { success: false, message: 'Topics Not Found', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Success', data: data.topics },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch topics" },
            { status: 500 }
        );
    }
}