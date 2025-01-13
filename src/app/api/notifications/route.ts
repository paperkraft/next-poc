import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import notificationEmitter from '@/lib/event-emitter';

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
        notificationEmitter.emit('newNotification');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}