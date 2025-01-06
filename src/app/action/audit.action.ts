'use server'

import prisma from "@/lib/prisma";
import { getFormattedDateTime } from "@/utils";
import { JsonObject } from "@prisma/client/runtime/library";
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

    
    if (!userId) {
        throw new Error("User ID is required.");
    }

    if (!(toDate instanceof Date) || isNaN(toDate.getTime())) {
        throw new Error("Invalid 'toDate' provided.");
    }
    // Fetch the audit log entries for the user
    const auditLogs = await prisma.auditLog.findMany({
        where: {
            userId,
            action: { in: ['login', 'logout'] },
            timestamp: { lte: toDate },
        },
        orderBy: { timestamp: 'asc' },
        select: {
            action: true,
            timestamp: true,
        },
    });

    const sessionTimeout: number = 12 * 60 * 60 * 1000;
    const dateWiseSessions: Record<string, { startTime: string; endTime: string; duration: string }[]> = {};
    let lastLoginTime: Date | null = null;

    const formatDuration = (ms: number): string => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    for (const log of auditLogs) {
        const logDate = log.timestamp.toISOString().split('T')[0];

        if (log.action === 'login') {
            // Track the last login time
            if (lastLoginTime) {
                // console.warn(`Duplicate login detected for userId: ${userId} at ${log.timestamp}`);

                // Force logout after sessionTimeout (if login happens after a long time)
                const timeDifference = log.timestamp.getTime() - lastLoginTime.getTime();

                if (timeDifference > sessionTimeout) {
                    // Assume the previous session ended and create a session for it
                    const durationMs = timeDifference;
                    const duration = formatDuration(durationMs);

                    if (!dateWiseSessions[logDate]) {
                        dateWiseSessions[logDate] = [];
                    }

                    dateWiseSessions[logDate].push({
                        startTime: `${getFormattedDateTime(lastLoginTime)} *`,
                        endTime: `${getFormattedDateTime(log.timestamp)}`,
                        duration,
                    });
                }
            }
            lastLoginTime = log.timestamp;
        } else if (log.action === 'logout' && lastLoginTime) {
            // Calculate the session duration between login and logout
            const durationMs = log.timestamp.getTime() - lastLoginTime.getTime();
            const duration = formatDuration(durationMs);

            if (!dateWiseSessions[logDate]) {
                dateWiseSessions[logDate] = [];
            }

            dateWiseSessions[logDate].push({
                startTime: `${getFormattedDateTime(lastLoginTime)}`,
                endTime: `${getFormattedDateTime(log.timestamp)}`,
                duration,
            });

            lastLoginTime = null; // Reset the last login time after a logout
        } else {
            console.warn(`Unexpected logout without prior login for user: ${userId} at ${log.timestamp}`);
        }
    }

    // Handle the case where the user is still logged in (no logout after the last login)
    if (lastLoginTime) {
        const currentDate = lastLoginTime.toISOString().split('T')[0];
        const durationMs = toDate.getTime() - lastLoginTime.getTime();
        const duration = formatDuration(durationMs);

         // If the session has been active for too long, we assume it's an "inactive" session
        //  if (durationMs > sessionTimeout) {
        //     lastLoginTime = null;  // Force session end if it exceeds timeout
        // }

        if (!dateWiseSessions[currentDate]) {
            dateWiseSessions[currentDate] = [];
        }

        dateWiseSessions[currentDate].push({
            startTime: `${getFormattedDateTime(new Date(lastLoginTime))}`,
            endTime: 'active',
            duration,
        });
    }

    return Object.entries(dateWiseSessions).map(([date, sessions]) => ({ date, sessions }));
}

export type LoginDetail = {
    timestamp: String;
    device?: string;
    ipAddress?: string;
};

export async function getLastThreeLogins(userId: string): Promise<LoginDetail[]> {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    // Query the last 3 login actions for the user
    const logins = await prisma.auditLog.findMany({
        where: {
            userId,
            action: 'login',
        },
        orderBy: {
            timestamp: 'desc',
        },
        take: 3,
        select: {
            timestamp: true,
            device: true,
        },
    });

    return logins.map((login) => {
        // const details = login.device ? JSON.parse(login.device) : {};
        const details = login.device ? login.device as JsonObject : {};
        return {
            timestamp: `${getFormattedDateTime(login.timestamp)}`,
            device: details.device +' '+ details.browser as string,
            ipAddress: details.ip as string,
        };
    });
}