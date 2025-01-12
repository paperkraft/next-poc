import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';
import notificationEmitter from '@/lib/event-emitter';

export async function GET(_req: Request) {
    let isStreamActive = true;
    const session = await auth();
    const userId = session?.user?.id

    const stream = new ReadableStream({
        async start(controller) {
            // Listen for new notifications
            const onNewNotification = async () => {
                console.log('New notification received');
                if (!isStreamActive) return;
                await sendNotifications(controller, userId);
            };

            // Add the listener
            notificationEmitter.on('newNotification', onNewNotification);

            // Send initial notifications
            await sendNotifications(controller, userId);

            // Cleanup logic
            controller.close = () => {
                isStreamActive = false;
                notificationEmitter.off('newNotification', onNewNotification);
                console.log('Cleanup triggered');
            };
        },

        cancel() {
            isStreamActive = false;
            console.log('Client disconnected');
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Transfer-Encoding': 'chunked',
        },
    });
}

export const extendedPrisma = new PrismaClient().$extends({
    model: {
        notification: {
            async getNotifications(userId: string) {
                return await prisma.notification.findMany({
                    where: { userId, read: false },
                    orderBy: { createdAt: 'desc' },
                });
            },
        }
    },
});

const sendNotifications = async (controller: any, userId: string) => {
    const encoder = new TextEncoder();
    try {
        const notifications = await extendedPrisma.notification.getNotifications(userId);
        if (notifications.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(notifications)}\n\n`));
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};