import { auth } from '@/auth';
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
                console.log('New notification');
                if (!isStreamActive) return;
                await sendNotifications(controller, userId);
            };

            // Add the listener
            notificationEmitter.on('newNotification', onNewNotification);

            // Send initial notifications
            await sendNotifications(controller, userId);

            // Cleanup
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

const sendNotifications = async (controller: ReadableStreamDefaultController, userId: string) => {
    const encoder = new TextEncoder();
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId, read: false },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        if (notifications.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(notifications)}\n\n`));
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};