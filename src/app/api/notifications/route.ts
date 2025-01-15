import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAllNotifications } from '@/app/action/notifications.action';
import { handleNoId } from '@/app/action/response.action';

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