import { auth } from '@/auth';
import { Prisma, PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

const prisma = new PrismaClient();
/**
 * Logs an action to the audit log.
 * 
 * @param action - A short description of the action (e.g., "USER_CREATED", "ROLE_UPDATED").
 * @param userId - The ID of the user who performed the action.
 * @param entity - Path of actual entity.
 * @param details - The response object or additional metadata to include in the log.
 */

export async function logAuditAction(
    action: string,
    entity: string,
    details: Prisma.InputJsonValue, 
    userId?: string
) {
    try {
        const session = await auth();
        const info = JSON.parse(JSON.stringify(details));
        const headersList = headers();
        const deviceDetails = getDeviceDetails(headersList.get('user-agent'));
        let ipAddress: string | undefined = headersList.get('X-Forwarded-For') as string || undefined;
        if (ipAddress === '::1') {
            ipAddress = 'Localhost (testing)';
        }

        await prisma.auditLog.create({
            data: {
                action,
                entity,
                userId: userId ?? session?.user?.id,
                details: info,
                device: {
                    ...deviceDetails,
                    ip: ipAddress,
                },
                timestamp: new Date(),
            },
        });
        
    } catch (error) {
        console.error('Failed to log audit action:', error);
    }
}

export function getDeviceDetails(userAgent: string | null): Record<string, string | undefined> {
    const parser = new UAParser(userAgent || '');
    return {
        browser: parser.getBrowser().name,
        os: parser.getOS().name,
        device: getDeviceType(userAgent as string),
    };
}

export function getDeviceType(userAgent: string): string {
    if (!userAgent) return 'Unknown device';

    // Check for mobile devices
    if (/mobile/i.test(userAgent)) {
        return 'Mobile device';
    }
    // Check for tablet devices
    else if (/tablet/i.test(userAgent)) {
        return 'Tablet device';
    }
    // Check for specific operating systems and browsers
    else if (/windows/i.test(userAgent)) {
        return 'Windows (Desktop)';
    }
    else if (/macintosh/i.test(userAgent)) {
        return 'MacOS (Desktop)';
    }
    else if (/linux/i.test(userAgent)) {
        return 'Linux (Desktop)';
    }
    else if (/android/i.test(userAgent)) {
        return 'Android device';
    }
    else if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent)) {
        return 'iOS device';
    }
    // General fallback
    else {
        return 'Desktop device';
    }
}