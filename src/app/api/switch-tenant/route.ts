import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth, unstable_update } from '@/auth'
import { cookies } from 'next/headers'
import { getRoleId, getRoleIdWithEmail } from '@/lib/menus'

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.globalRoles?.includes('SYSTEM_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { tenantId } = await req.json();

    if (+tenantId === 0) {
        const roleId = await getRoleIdWithEmail(session.user.email);
        await unstable_update({ ...session.user, tenantId: null, slug: undefined, roleId: +roleId });

        return NextResponse.json({
            success: true,
            tenant: {
                slug: 'admin'
            }
        })
    }

    // Verify the tenant exists
    const tenant = await prisma.tenant.findUnique({
        where: { id: +tenantId }
    })

    if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const roleId = await getRoleId(tenant.id);
    await unstable_update({ ...session.user, tenantId: tenant.id, slug: tenant.slug, roleId: +roleId });

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