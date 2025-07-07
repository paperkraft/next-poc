'use server'

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { RoleWidget, TenantWidget, Widget } from '@prisma/client';
import { AvailableWidget, FullUserWidget } from '@/types/widget';

export async function getUserWidgets(userId: number): Promise<FullUserWidget[]> {
    const widgets = await prisma.userWidget.findMany({
        where: { userId },
        include: {
            widget: {
                include: {
                    widget: true,
                }
            },
            roleWidget: true
        },
        orderBy: { sortOrder: 'asc' }
    })

    // Map raw data to FullUserWidget interface
    return widgets.map((uw) => ({
        id: uw.id,
        widgetId: uw.widgetId,
        isPinned: uw.isPinned,
        isHidden: uw.isHidden,
        customSize: uw.customSize as 'small' | 'medium' | 'large', // type assertion
        sortOrder: uw.sortOrder,
        widget: {
            id: uw.widget.widget.id,
            key: uw.widget.widget.key,
            name: uw.widget.widget.name,
            description: uw.widget.widget.description ?? '',
            component: uw.widget.widget.component,
        },
        roleWidget: {
            id: uw.roleWidget.id,
            roleId: uw.roleWidget.roleId,
            widgetId: uw.roleWidget.widgetId,
            isAssigned: uw.roleWidget.isAssigned,
            sortOrder: uw.roleWidget.sortOrder,
        },
    }));
}

export async function getAvailableWidgets(tenantSlug: string, userId: number): Promise<AvailableWidget[]> {
    // Get widgets assigned to tenant that user doesn't already have
    const widgets = await prisma.tenantWidget.findMany({
        where: {
            OR: [
                { tenant: { slug: tenantSlug } },
            ],
            roleWidget: {
                some: {
                    isAssigned: true,
                    role: {
                        users: {
                            some: { id: userId }
                        }
                    }
                }
            }
        },
        include: {
            widget: true,
            roleWidget: true
        }
    });

    return widgets.map(tw => ({
        id: tw.id, // TenantWidget.id
        widget: {
            id: tw.widget.id,
            key: tw.widget.key,
            name: tw.widget.name,
            description: tw.widget.description ?? '',
            component: tw.widget.component,
        }
    }));
}

export async function assignWidgetToRole({
    tenantSlug,
    roleId,
    widgetId,
    isAssigned
}: {
    tenantSlug: string
    roleId: number
    widgetId: number
    isAssigned: boolean
}): Promise<RoleWidget> {
    const session = await auth()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true }
    })

    if (!tenant) {
        throw new Error('Tenant not found')
    }

    const result = await prisma.roleWidget.upsert({
        where: { roleId_widgetId: { roleId, widgetId } },
        update: { isAssigned },
        create: {
            roleId,
            widgetId,
            isAssigned,
            // tenantId: tenant.id,
            sortOrder: 0
        }
    })

    revalidatePath(`/${tenantSlug}/dashboard/widgets`)
    return result
}

export async function updateUserWidget({
    userWidgetId,
    userId,
    updates
}: {
    userWidgetId: number
    userId: number
    updates: {
        isPinned?: boolean
        isHidden?: boolean
        customSize?: string
        sortOrder?: number
    }
}): Promise<FullUserWidget> {
    const session = await auth()
    if (!session?.user || +session.user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const updated = await prisma.userWidget.update({
        where: { id: userWidgetId, userId },
        data: updates,
        include: {
            widget: {
                include: {
                    widget: true
                }
            },
            roleWidget: true
        }
    })

    revalidatePath(`/${session.user.slug}/dashboard`);

    return {
        id: updated.id,
        widgetId: updated.widgetId,
        isPinned: updated.isPinned,
        isHidden: updated.isHidden,
        customSize: updated.customSize as 'small' | 'medium' | 'large',
        sortOrder: updated.sortOrder,
        widget: {
            id: updated.widget.widget.id,
            key: updated.widget.widget.key,
            name: updated.widget.widget.name,
            description: updated.widget.widget.description ?? '',
            component: updated.widget.widget.component
        },
        roleWidget: {
            id: updated.roleWidget.id,
            roleId: updated.roleWidget.roleId,
            widgetId: updated.roleWidget.widgetId,
            isAssigned: updated.roleWidget.isAssigned,
            sortOrder: updated.roleWidget.sortOrder
        }
    };
}

export async function addWidgetToUser({
    userId,
    widgetId
}: {
    userId: number
    widgetId: number
}): Promise<FullUserWidget> {
    const session = await auth()
    if (!session?.user || +session.user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const roleWidget = await prisma.roleWidget.findFirst({
        where: {
            widgetId,
            isAssigned: true,
            role: {
                users: {
                    some: { id: userId }
                }
            }
        }
    })

    if (!roleWidget) {
        throw new Error('Widget not available for your role')
    }

    const maxOrder = await prisma.userWidget.aggregate({
        where: { userId },
        _max: { sortOrder: true }
    })

    const newWidget = await prisma.userWidget.create({
        data: {
            userId,
            widgetId,
            roleWidgetId: roleWidget.id,
            sortOrder: (maxOrder._max.sortOrder || 0) + 1
        },
        include: {
            widget: {
                include: {
                    widget: true
                }
            },
            roleWidget: true
        }
    })

    revalidatePath(`/${session.user.slug}/dashboard/widgets`)

    // Map to FullUserWidget type
    return {
        id: newWidget.id,
        widgetId: newWidget.widgetId,
        isPinned: newWidget.isPinned,
        isHidden: newWidget.isHidden,
        customSize: newWidget.customSize as 'small' | 'medium' | 'large',
        sortOrder: newWidget.sortOrder,
        widget: {
            id: newWidget.widget.widget.id,
            key: newWidget.widget.widget.key,
            name: newWidget.widget.widget.name,
            description: newWidget.widget.widget.description ?? '',
            component: newWidget.widget.widget.component
        },
        roleWidget: {
            id: newWidget.roleWidget.id,
            roleId: newWidget.roleWidget.roleId,
            widgetId: newWidget.roleWidget.widgetId,
            isAssigned: newWidget.roleWidget.isAssigned,
            sortOrder: newWidget.roleWidget.sortOrder
        }
    };
}

export async function removeWidgetFromUser({
    userWidgetId,
    userId
}: {
    userWidgetId: number
    userId: number
}): Promise<void> {
    const session = await auth()
    if (!session?.user || +session.user.id !== userId) {
        throw new Error('Unauthorized')
    }

    await prisma.userWidget.delete({
        where: {
            id: userWidgetId,
            userId
        }
    })

    revalidatePath(`/${session.user.slug}/dashboard/widgets`)
}

export async function reorderUserWidgets({
    userId,
    updates
}: {
    userId: number
    updates: Array<{ userWidgetId: number; sortOrder: number }>
}): Promise<void> {
    const session = await auth()
    if (!session?.user || +session.user.id !== userId) {
        throw new Error('Unauthorized')
    }

    await prisma.$transaction(
        updates.map(({ userWidgetId, sortOrder }) =>
            prisma.userWidget.update({
                where: { id: userWidgetId, userId },
                data: { sortOrder }
            })
        ))

    revalidatePath(`/${session.user.slug}/dashboard/widgets`)

}

export async function resetUserWidgets(userId: number): Promise<FullUserWidget[]> {
    const session = await auth()
    if (!session?.user || +session.user.id !== userId) {
        throw new Error('Unauthorized')
    }

    // Delete existing widgets
    await prisma.userWidget.deleteMany({ where: { userId } })

    // Get default widgets for user's role
    const roleWidgets = await prisma.roleWidget.findMany({
        where: {
            role: { users: { some: { id: userId } } },
            isAssigned: true,
            widget: { isDefault: true }
        },
        include: {
            widget: {
                include: {
                    widget: true // Includes the inner `Widget` model
                }
            }
        }
    })

    //  Create new user widgets
    const created = await Promise.all(
        roleWidgets.map((rw, index) =>
            prisma.userWidget.create({
                data: {
                    userId,
                    widgetId: rw.widgetId,
                    roleWidgetId: rw.id,
                    sortOrder: index,
                    isPinned: false,
                    isHidden: false,
                    customSize: 'small'
                },
                include: {
                    widget: {
                        include: {
                            widget: true
                        }
                    },
                    roleWidget: true
                }
            })
        )
    )

    revalidatePath(`/${session.user.slug}/dashboard/widgets`)
    // Map Prisma response to FullUserWidget[]
    return created.map((uw): FullUserWidget => ({
        id: uw.id,
        widgetId: uw.widgetId,
        isPinned: uw.isPinned,
        isHidden: uw.isHidden,
        customSize: uw.customSize as 'small' | 'medium' | 'large',
        sortOrder: uw.sortOrder,
        widget: {
            id: uw.widget.widget.id,
            key: uw.widget.widget.key,
            name: uw.widget.widget.name,
            description: uw.widget.widget.description ?? '',
            component: uw.widget.widget.component
        },
        roleWidget: {
            id: uw.roleWidget.id,
            roleId: uw.roleWidget.roleId,
            widgetId: uw.roleWidget.widgetId,
            isAssigned: uw.roleWidget.isAssigned,
            sortOrder: uw.roleWidget.sortOrder
        }
    }));
}

// ------------------------- admin panel widgets actions ------------------------------ //

export async function getTenantRoles(tenantSlug: string) {
    return prisma.role.findMany({
        where: { tenant: { slug: tenantSlug } },
        select: {
            id: true,
            name: true
        }
    })
}

export async function updateRoleWidgetAssignment({
    tenantSlug,
    roleId,
    widgetId,
    isAssigned
}: {
    tenantSlug: string
    roleId: number
    widgetId: number
    isAssigned: boolean
}): Promise<{ success: boolean; message?: string }> {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Verify the widget belongs to the tenant
            const tenantWidget = await tx.tenantWidget.findFirst({
                where: {
                    widgetId,
                    tenant: { slug: tenantSlug }
                }
            });

            if (!tenantWidget) {
                throw new Error('Widget not found for this tenant');
            }

            // 2. Update or create RoleWidget assignment
            const roleWidget = await tx.roleWidget.upsert({
                where: {
                    roleId_widgetId: {
                        roleId,
                        widgetId: tenantWidget.id // Use tenantWidget.id instead of widgetId
                    }
                },
                create: {
                    isAssigned,
                    sortOrder: await tx.roleWidget.count({ where: { roleId } }),
                    role: { connect: { id: roleId } },
                    widget: { connect: { id: tenantWidget.id } } // Connect to TenantWidget
                },
                update: { isAssigned }
            });

            // 3. Handle user widgets based on assignment
            if (isAssigned) {
                // Add to all users with this role
                const users = await tx.user.findMany({
                    where: { roleId },
                    select: { id: true }
                });

                await Promise.all(
                    users.map(user =>
                        tx.userWidget.upsert({
                            where: {
                                userId_widgetId: {
                                    userId: user.id,
                                    widgetId: tenantWidget.id // Use tenantWidget.id
                                }
                            },
                            create: {
                                isPinned: false,
                                isHidden: false,
                                customSize: 'small',
                                sortOrder: roleWidget.sortOrder,
                                user: { connect: { id: user.id } },
                                widget: { connect: { id: tenantWidget.id } },
                                roleWidget: { connect: { id: roleWidget.id } }
                            },
                            update: {
                                isHidden: false // Unhide if previously hidden
                            }
                        })
                    )
                );
            } else {
                // Remove from all users with this role
                await tx.userWidget.deleteMany({
                    where: {
                        roleWidgetId: roleWidget.id
                    }
                });
            }

            revalidatePath(`/${tenantSlug}/admin/widgets`, 'page');
            return { success: true };
        });
    } catch (error) {
        console.error('Error updating role widget assignment:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update assignment'
        };
    }
}

export async function getTenantWidgetsWithAssignments(tenantSlug: string) {
    // 1. Get all tenant widgets with their role assignments
    const tenantWidgets = await prisma.tenantWidget.findMany({
        where: { tenant: { slug: tenantSlug } },
        include: {
            widget: true,
            roleWidget: {
                include: {
                    role: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            widget: {
                name: 'asc'
            }
        }
    });

    // 2. Get all roles for this tenant
    const roles = await prisma.role.findMany({
        where: { tenant: { slug: tenantSlug } },
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: 'asc'
        }
    });

    // 3. Transform the data
    return tenantWidgets.map(tenantWidget => {
        // Create role assignments for all tenant roles
        const roleAssignments = roles.map(role => {
            const roleConfig = tenantWidget.roleWidget.find(rw => rw.roleId === role.id);
            return {
                roleId: role.id,
                roleName: role.name,
                isAssigned: roleConfig ? roleConfig.isAssigned : false,
                sortOrder: roleConfig ? roleConfig.sortOrder : 0
            };
        });

        return {
            ...tenantWidget.widget, // Spread the widget data
            isDefault: tenantWidget.isDefault,
            tenantWidgetId: tenantWidget.id,
            roles: roleAssignments
        };
    });
}