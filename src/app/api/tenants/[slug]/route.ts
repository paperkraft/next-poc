import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { slug: params.slug },
        })

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
        }

        return NextResponse.json(tenant)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tenant' },
            { status: 500 }
        )
    }
}