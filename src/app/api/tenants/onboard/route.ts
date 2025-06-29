import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { makePassword } from '@/utils/password';

export async function POST(req: NextRequest) {
    try {
        const { organization, type, email, password, ...rest } = await req.json();

        if (!organization || !type || !email || !password) {
            return NextResponse.json({
                succes: false,
                message: 'Missing fields'
            }, { status: 400 });
        }

        // Create PENDING tenant request
        const existing = await prisma.tenant.findFirst({
            where: { name: organization, type },
        });

        if (existing) {
            return NextResponse.json({
                succes: false,
                message: 'Tenant already exists or pending approval'
            }, { status: 409 });
        }

        const tenant = await prisma.tenant.create({
            data: {
                name: organization,
                type,
                slug: organization.trim(),
                address: {
                    country: 'India',
                    state: rest.state,
                    city: rest.city,
                },
                contact: {
                    contactEmail: email,
                }
            },
        });

        const roleId = await prisma.role.findFirst({
            where: { name: "guest" },
            select: { id: true }
        })

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User already exists'
            }, { status: 409 });
        }

        const hashedPassword = await makePassword(password)

        if (tenant) {
            await prisma.user.create({
                data: {
                    ...rest,
                    email,
                    password: hashedPassword,
                    roleId: roleId?.id,
                    tenantId: tenant.id
                }
            })
        }

        return NextResponse.json({ success: true, message: 'Tenant submitted for approval' });
    } catch (error) {
        console.error('Tenant onboard error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}
