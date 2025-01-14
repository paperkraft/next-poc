'use server'

import prisma from "@/lib/prisma"
import { handleError, handleNoId, handleSuccess } from "./response.action"

export const getAllNotifications = async (userId: string) => {
    try {

        if (!userId) {
            return await handleNoId("UserId required")
        }

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })

        return await handleSuccess("Success", notifications)

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