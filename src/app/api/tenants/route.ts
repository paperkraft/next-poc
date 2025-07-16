import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Tenant, TenantType } from '@prisma/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const type = searchParams.get('type') as TenantType | null;

        const where = type ? { type } : {};

        const [tenants, total] = await Promise.all([
            prisma.tenant.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    parent: true,
                    _count: {
                        select: { users: true }
                    }
                }
            }),
            prisma.tenant.count({ where })
        ]);

        return NextResponse.json({
            data: tenants,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tenants' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'> = await request.json();

        // Validate required fields
        if (!body.name || !body.slug || !body.type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check for existing tenant with same slug or name
        const existing = await prisma.tenant.findFirst({
            where: {
                OR: [
                    { name: body.name },
                    { slug: body.slug }
                ]
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Tenant with this name or slug already exists' },
                { status: 409 }
            );
        }

        const tenant = await prisma.tenant.create({
            data: {
                ...body,
                address: body.address || {},
                settings: body.settings || {},
                contact: body.contact || {},
                limits: body.limits || {},
                branding: body.branding || {},
                customField: body.customField || {},
                features: body.features || [],
                isActive: body.isActive !== undefined ? body.isActive : true
            }
        });

        return NextResponse.json(tenant, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create tenant' },
            { status: 500 }
        );
    }
}