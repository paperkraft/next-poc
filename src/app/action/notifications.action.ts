'use server'

import { NextResponse } from 'next/server';

import notificationEmitter from '@/lib/event-emitter';
import prisma from '@/lib/prisma';
import { sendWebPushNotification } from '@/lib/web-push';

import { handleError, handleNoId, handleSuccess } from './response.action';

export const getAllNotifications = async (userId: string) => {
    try {

        if (!userId) {
            return await handleNoId("UserId required")
        }

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        })

        // Set no-cache headers
        const response = NextResponse.json(
            { success: true, data: notifications },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
            }
        );

        return response;

    } catch (error) {
        return await handleError("Error fetching notifications", error)
    }
}

export const getUnreadNotifications = async (userId: string) => {
    try {
        if (!userId) {
            return await handleNoId("UserId required")
        }

        const notifications = await prisma.notification.findMany({
            where: { userId, read: false },
            orderBy: { createdAt: 'desc' }
        })

        return await handleSuccess("Success", notifications)

    } catch (error) {
        return await handleError("Error fetching notifications", error)
    }
}

type SendNotificationInput = { topics?: string[]; userId?: string; title: string; message: string }

export async function sendNotification(input: SendNotificationInput) {

    if ((!input.topics && !input.userId)) {
        return { success: false, message: " Topic or UserId is required" }
    }

    let userIds: string[] = [];

    console.log('input', input);

    if (input.topics) {
        // Send to all users subscribed to the topic
        const subscriptions = await prisma.subscription.findMany({
            where: { topics: { hasSome: input.topics } },
            select: { userId: true },
        });

        userIds = Array.from(new Set(subscriptions.map((s) => s.userId)));
    } else if (input.userId) {
        userIds = [input.userId];
    }

    const notifications = userIds.map((userId) => ({
        title: input.title,
        message: input.message,
        topic: input.topics ? input.topics.join(",") : undefined,
        userId: userId,
        status: "sent",
    }));

    const newNotification = await prisma.notification.createMany({ data: notifications });

    //SECTION - Emitter new notificaiton
    notificationEmitter.emit('newNotification', newNotification)

    //SECTION - Push notification
    const subscriptions = await prisma.subscription.findMany({
        where: { userId: { in: userIds } },
    });

    if (subscriptions.length === 0) {
        return { success: false, message: "No subscriptions found" };
    }

    for (const sub of subscriptions) {
        try {
            await sendWebPushNotification({
                subscription: sub.subscription,
                title: input.title,
                body: input.message,
            });
        } catch (error: any) {
            console.error("Push failed", error);
            // Optional: remove dead subscriptions

            if (error.statusCode === 410 || error.statusCode === 404) {
                console.log(`Deleting expired subscription: ${sub.id}`);
                await prisma.subscription.delete({
                    where: { id: sub.id }
                });
            }
        }
    }

    return { success: true, count: userIds.length };
}