'use server'

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function fetchAuditLogs() {
    try {
        const auditLog = await prisma.auditLog.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        return NextResponse.json(
            { success: true, message: 'Success', data: auditLog },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching auditLog:", error);
        return NextResponse.json(
            { success: false, message: 'Error fetching auditLog' },
            { status: 500 }
        );
    }
}

export type DateWiseOnlineSession = {
    date: string;
    sessions: { startTime: string; endTime: string; duration: string }[];
};


export async function calculateDateWiseOnlineSessions(userId: string, toDate: Date = new Date()): Promise<DateWiseOnlineSession[]> {
    // Fetch the audit log entries for the user
    const auditLogs = await prisma.auditLog.findMany({
        where: {
            userId,
            action: { in: ['login', 'logout'] },
            timestamp: { lte: toDate }, // Ensure logs are up to the given date
        },
        orderBy: { timestamp: 'asc' },
        select: {
            action: true,
            timestamp: true,
        },
    });

    const dateWiseSessions: Record<string, { startTime: string; endTime: string; duration: string }[]> = {};
    let lastLoginTime: Date | null = null;

    for (const log of auditLogs) {
        const logDate = log.timestamp.toISOString().split('T')[0];

        if (log.action === 'login') {
            // Track the last login time
            lastLoginTime = log.timestamp;
        } else if (log.action === 'logout' && lastLoginTime) {
            // Calculate the session duration between login and logout
            const durationMs = log.timestamp.getTime() - lastLoginTime.getTime();
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            if (!dateWiseSessions[logDate]) {
                dateWiseSessions[logDate] = [];
            }

            dateWiseSessions[logDate].push({
                startTime: lastLoginTime.toISOString(),
                endTime: log.timestamp.toISOString(),
                duration,
            });

            lastLoginTime = null; // Reset the last login time after a logout
        }
    }

    // Handle the case where the user is still logged in (no logout after the last login)
    if (lastLoginTime) {
        const currentDate = lastLoginTime.toISOString().split('T')[0];
        const durationMs = toDate.getTime() - lastLoginTime.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        if (!dateWiseSessions[currentDate]) {
            dateWiseSessions[currentDate] = [];
        }

        dateWiseSessions[currentDate].push({
            startTime: lastLoginTime.toISOString(),
            endTime: 'ONGOING',
            duration,
        });
    }

    return Object.entries(dateWiseSessions).map(([date, sessions]) => ({ date, sessions }));
}