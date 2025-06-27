'use server'
import { auth, unstable_update } from '@/auth';
import { AuditAction, Prisma } from '@prisma/client';
import { headers } from 'next/headers';
import { getDeviceDetails } from './utils';
import prisma from './prisma';
interface AuditProps {
    action: AuditAction,
    entity: string,
    details: Prisma.InputJsonValue,
    userId?: number,
    tenantId?: number | null,
    slug?: string
}

/**
 * Logs an action to the audit log.
 * 
 * @param action - A short description of the action (e.g., "USER_CREATED", "ROLE_UPDATED").
 * @param entity - Path of actual entity.
 * @param details - The response object or additional metadata to include in the log.
 * @param userId - The ID of the user who performed the action.
 * @param tenantId - The ID of the tenant user who performed the action.
 */

export async function logAuditAction({ action, entity, details, userId, tenantId, slug }: AuditProps) {
    try {
        const session = await auth();
        const info = JSON.parse(JSON.stringify(details));
        const headersList = headers();
        const deviceDetails = getDeviceDetails(headersList.get('user-agent'));
        let ipAddress: string | undefined = headersList.get('X-Forwarded-For') as string || undefined;
        if (ipAddress === '::1') {
            ipAddress = 'Localhost';
        }

        await unstable_update({ ...session?.user });

        await prisma.auditLog.create({
            data: {
                action,
                entity,
                userId: userId ?? +session?.user?.id,
                tenantId: tenantId ?? session?.user?.tenantId,
                slug: slug ?? session?.user?.slug,
                details: info,
                device: {
                    ...deviceDetails,
                    ip: ipAddress,
                },
                createdAt: new Date(),
            },
        });

    } catch (error) {
        console.error('Failed to log audit action:', error);
    }
}