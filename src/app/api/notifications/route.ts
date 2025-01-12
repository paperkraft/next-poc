import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
    const { notificationIds } = await req.json();

    try {

        if (Array.isArray(notificationIds)) {
            await prisma.notification.updateMany({
                where: { id: { in: notificationIds } },
                data: { read: true },
            });

        } else {
            await prisma.notification.update({
                where: { id: notificationIds },
                data: { read: true },
            });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}