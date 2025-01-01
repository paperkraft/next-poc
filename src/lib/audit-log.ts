import { Prisma, PrismaClient } from '@prisma/client';
import { UAParser } from 'ua-parser-js';

const prisma = new PrismaClient();

/**
 * Logs an action to the audit log.
 * 
 * @param action - A short description of the action (e.g., "USER_CREATED", "ROLE_UPDATED").
 * @param userId - The ID of the user who performed the action.
 * @param details - The response object or additional metadata to include in the log.
 */
export async function logAuditAction(
    action: string,
    userId: string,
    details: Prisma.InputJsonValue,
    // request: Request
) {
    try {
        // const ip = getClientIp(request);
        // const deviceDetails = getDeviceDetails(request.headers.get('user-agent'));

        await prisma.auditLog.create({
            data: {
                action,
                userId,
                details: details,
                timestamp: new Date(),
            },
        });
    } catch (error) {
        console.error('Failed to log audit action:', error);
    }
}


export function getClientIp(request: Request): string | undefined {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0]; // First IP in the chain
    }
    return request.headers.get('host') || undefined;
}

export function getDeviceDetails(userAgent: string | null): Record<string, string | undefined> {
    const parser = new UAParser(userAgent || '');
    return {
        browser: parser.getBrowser().name,
        os: parser.getOS().name,
        device: parser.getDevice().type,
    };
}