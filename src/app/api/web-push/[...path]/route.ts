import { auth } from '@/auth';
import notificationEmitter from '@/lib/event-emitter';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import webpush, { PushSubscription } from 'web-push';
// Set VAPID details for WebPush
const VAPID_EMAIL = 'mailto:mail@example.com';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
const VAPID_PRIVATE_KEY = process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY as string;

// Set VAPID details
webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);


export async function POST(request: Request) {
    const { pathname } = new URL(request.url);
    switch (pathname) {
        case '/api/web-push/subscription':
            return handleSetSubscription(request);
        case '/api/web-push/send':
            return handleSendPush(request);
        case '/api/web-push/send-to-topic':
            return handleSendToTopic(request);
        default:
            return handleNotFound();
    }
}

// Handle setting the subscription
async function handleSetSubscription(request: Request) {

    try {
        const session = await auth();
        const userId: string = session?.user?.id;

        const { subscription }: { subscription: PushSubscription } = await request.json();

        const subscriptionString = JSON.stringify(subscription);

        // Check if the user already has a subscription using JSON comparison
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                userId,
                subscription: {
                    equals: subscriptionString,
                },
            },
        });

        if (existingSubscription) {
            return NextResponse.json(
                { success: true, message: 'Subscription already exists' },
                { status: 200 }
            );
        }

        // Store the new subscription in the database
        await prisma.subscription.create({
            data: {
                userId,
                subscription: subscriptionString,
                topic: "user"
            },
        });

        return NextResponse.json(
            { success: true, message: 'Subscription saved successfully' },
            { status: 200 }
        );
    } catch (error) {
        return handleError('Failed to set subscription', error);
    }
}

// Handle sending notification to user
async function handleSendPush(request: Request) {
    const { userId, ...data } = await request.json();
    const message = data?.body;

    if (!userId || !data.body) {
        return NextResponse.json(
            { success: false, error: { message: 'Missing userId or notification details' } },
            { status: 400 }
        );
    }

    try {
        // Fetch the user's subscription details from the database
        const subscriptionData = await prisma.subscription.findMany({
            where: { userId },
        });

        if (subscriptionData.length === 0) {
            return NextResponse.json(
                { success: false, message: 'User subscription not found' },
                { status: 404 }
            );
        }

        const payload = JSON.stringify(data);

        // Send the push notification to subscription devices
        await Promise.all(
            subscriptionData.map(async (element) => {
                const subscription: PushSubscription = JSON.parse(element.subscription as string);
                return webpush.sendNotification(subscription, payload);
            })
        );

        // Log the notification into the database
        await saveNotificationToDB(userId, message, "sent");

        return NextResponse.json(
            { success: true, message: 'Notification sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        await saveNotificationToDB(userId, message, "failed");
        return handleError('Failed to send notification', error);
    }
}

// Handle sending notification to topic
async function handleSendToTopic(request: Request) {
    const { topic, ...data } = await request.json();
    const message = data?.body;

    try {
        if (!topic || !message) {
            return NextResponse.json(
                { success: false, error: { message: 'Missing topic or message details' } },
                { status: 400 }
            );
        }

        // Fetch all subscriptions for users in the given group
        const subscriptionData = await prisma.subscription.findMany({
            where: { topic },
        });

        if (!subscriptionData.length) {
            return NextResponse.json(
                { success: false, message: 'No subscriptions found for this topic' },
                { status: 404 }
            );
        }

        const pushPayload = JSON.stringify({ ...data, title: 'Group Notification' });

        await Promise.all(
            subscriptionData.map(async (element) => {
                const subscription: PushSubscription = JSON.parse(element.subscription as string);
                return webpush.sendNotification(subscription, pushPayload);
            })
        );

        const status = 'sent';
        await saveNotificationToDB(undefined, message, status);

        return NextResponse.json(
            { success: true, message: 'Notification sent to topic successfully' },
            { status: 200 }
        );
    } catch (error) {
        const status = 'failed';
        await saveNotificationToDB(undefined, message, status);
        return handleError('Failed to send notification to group', error);
    }
}

// Save the notification details to the database
async function saveNotificationToDB(userId: string | undefined, message: string, status: string) {
    try {
        const newNotification = await prisma.notification.create({
            data: {
                userId,
                message,
                status
            },
        });

        newNotification && notificationEmitter.emit('newNotification', newNotification);
        return NextResponse.json({ success: true, data: newNotification });
    } catch (error) {
        console.error('Error saving notification to DB', error);
        return handleError('Error saving notification to DB', error);
    }
}

// Generic error handler
function handleError(message: string, error: unknown) {
    console.error(message, error);
    return NextResponse.json(
        { success: false, message },
        { status: 500 }
    );
}

// Handle 404 errors
async function handleNotFound() {
    console.error('Invalid endpoint');
    return NextResponse.json(
        { success: false, message: "Invalid endpoint" },
        { status: 404 }
    );
}