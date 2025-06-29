import { auth } from "@/auth"
import prisma from "./prisma";
import { getTenantBySlug } from "./menus";

export async function getTenantsForAdmin() {
    return prisma.tenant.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            isActive: true
        },
        orderBy: {
            name: 'asc'
        }
    })
}

export async function validateTenantAccess(tenantSlug: string) {
    const session = await auth()

    if (!session) {
        return {
            isValid: false,
            redirectPath: '/signin?callbackUrl=/' + tenantSlug
        }
    }

    const currentSlug = session.user?.slug ?? "admin";
    const globalRoles = session.user?.globalRoles

    const tenant = await getTenantBySlug(tenantSlug);

    if (globalRoles?.includes('SYSTEM_ADMIN')) {

        if (!tenant) {
            return {
                isValid: false,
                redirectPath: `/${currentSlug}/dashboard`,
                tenant: null
            }
        }

        return { isValid: true, tenant }
    }

    if (currentSlug !== tenantSlug) {
        return {
            isValid: false,
            redirectPath: `/${currentSlug}/dashboard`,
            tenant: null
        }
    }

    return { isValid: true, tenant }
}

export async function validateTenantAccessAdmin(tenantId: number, userId: number) {
    // For system admins, allow access to all tenants
    const user = await prisma.user.findUnique({
        where: { id: +userId },
        select: { globalRoles: true }
    })

    const globalRoles: any = user?.globalRoles

    if (globalRoles?.includes('SYSTEM_ADMIN')) {
        return { hasAccess: true }
    }

    // For regular users, check tenant membership
    const membership = await prisma.user.findUnique({
        where: { id: +userId, tenantId: +tenantId }
    })

    return { hasAccess: !!membership }
}