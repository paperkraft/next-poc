import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAllNotifications } from '@/app/action/notifications.action';
import { handleNoId } from '@/app/action/response.action';
import { auth } from '@/auth';

export async function PUT(req: Request) {
    const { notificationIds } = await req.json();
    try {

        if (Array.isArray(notificationIds)) {
            await prisma.notification.updateMany({
                where: { id: { in: notificationIds } },
                data: { read: true },
            });
            return NextResponse.json({ success: true });
        } else {
            await prisma.notification.update({
                where: { id: notificationIds },
                data: { read: true },
            });
            return NextResponse.json({ success: true });
        }

    } catch (error) {
        return NextResponse.json({ success: false });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
        return await handleNoId("UserId required")
    }
    return await getAllNotifications(userId);
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId: string = session?.user?.id;

        const { subscription } = await req.json();

        if (!subscription) {
            return NextResponse.json({ valid: false }, { status: 400 });
        }

        const subscriptionString = JSON.stringify(subscription);

        // Check if the user already has a subscription using JSON comparison
        const existingSubscription = await prisma.subscription.findFirst({
            where: { 
                userId,
                subscription:{
                    equals: subscriptionString
                }
             },
        });

        if (existingSubscription) {
            return NextResponse.json({ valid: true });
        } else {
            return NextResponse.json({ valid: false });
        }
    } catch (error) {
        console.error('Error verifying subscription:', error);
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}