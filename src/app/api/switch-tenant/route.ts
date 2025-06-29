import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth, unstable_update } from '@/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.globalRoles?.includes('SYSTEM_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { tenantId } = await req.json()

    // Verify the tenant exists
    const tenant = await prisma.tenant.findUnique({
        where: { id: +tenantId }
    })

    if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // await unstable_update({ user: { ...session.user, tenanId: tenant.id, slug: tenant.slug } });

    // Set tenant context cookies
    cookies().set('x-tenant-id', tenant.id.toString(), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    cookies().set('x-tenant-slug', tenant.slug, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })


    return NextResponse.json({
        success: true,
        tenant: {
            id: tenant.id,
            slug: tenant.slug,
            name: tenant.name
        }
    })
}