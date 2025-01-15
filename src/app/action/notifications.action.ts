'use server'

import prisma from "@/lib/prisma"
import { handleError, handleNoId, handleSuccess } from "./response.action"
import { NextResponse } from "next/server"

export const getAllNotifications = async (userId: string) => {
    try {

        if (!userId) {
            return await handleNoId("UserId required")
        }

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
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