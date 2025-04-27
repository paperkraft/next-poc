'use server'

import prisma from "@/lib/prisma"
import { handleError, handleNoId, handleSuccess } from "./response.action"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

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

export async function subscribeUser(subscription: object, topic?: string) {
    try {
        const session = await auth();
        const userId: string = session?.user?.id;

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
                topic: topic ?? "user"
            },
        });

        return { success: true, message: 'Subscription saved successfully' }
    } catch (error) {
        return { success: false, message: 'Failed to set subscription' }
    }
}