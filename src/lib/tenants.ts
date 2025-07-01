import { auth } from "@/auth"
import prisma from "./prisma";
import { headers } from "next/headers";
import { Tenant } from "@prisma/client";
// import { getTenantBySlug } from "./menus";

export async function getTenantsForAdmin() {
    return prisma.tenant.findMany({
        // select: {
        //     id: true,
        //     name: true,
        //     slug: true,
        //     isActive: true
        // },
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

// ------------------------------------------------------------ //

// Tenant context utilities
export interface TenantContext {
    id: number
    name: string
    slug: string
    type: "UNIVERSITY" | "COLLEGE" | "SCHOOL" | "SOCIETY"
    settings: any
    branding: any
    features: string[]
    isActive: boolean
}

// Get current tenant from middleware headers or URL path
export async function getCurrentTenant(): Promise<TenantContext | null> {
    const headersList = headers()
    let tenantSlug = headersList.get("x-tenant-slug")

    // Fallback: extract from URL if header not available
    if (!tenantSlug) {
        const originalPath = headersList.get("x-original-path") || ""
        const pathSegments = originalPath.split("/").filter(Boolean)
        tenantSlug = pathSegments[0]
    }

    if (!tenantSlug) {
        return null
    }

    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                slug: tenantSlug,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                settings: true,
                branding: true,
                features: true,
                isActive: true,
            },
        })

        return tenant as TenantContext
    } catch (error) {
        console.error("Error fetching tenant:", error)
        return null
    }
}

// Get tenant by slug (for API routes and client-side)
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                slug,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                settings: true,
                branding: true,
                features: true,
                isActive: true,
            },
        })

        return tenant as Tenant
    } catch (error) {
        console.error("Error fetching tenant by slug:", error)
        return null
    }
}

// Extract tenant slug from pathname
export function extractTenantSlugFromPath(pathname: string): string | null {
    const pathSegments = pathname.split("/").filter(Boolean)
    return pathSegments[0] || null
}

// Validate user access to tenant
export async function validateUserTenantAccess(userId: number, tenantId: number): Promise<boolean> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                tenantId: tenantId,
                isActive: true,
            },
        })

        return !!user
    } catch (error) {
        console.error("Error validating user tenant access:", error)
        return false
    }
}