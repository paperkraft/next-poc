'use server'

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { RoleWidget } from '@prisma/client';
import { AvailableWidget, FullUserWidget } from '@/types/widget';
import { redirect } from 'next/navigation';
import { roleColors } from '@/constants/widget';
import { forEach } from 'lodash';

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
    return widgets.map((uw) => mapToFullUserWidget(uw));
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
    return mapToFullUserWidget(updated)
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
    return mapToFullUserWidget(newWidget)
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
    return created.map((uw): FullUserWidget => mapToFullUserWidget(uw));
}

// ------------------- FullWidget Transform function ---------------------------------- //

function mapToFullUserWidget(widget: any): FullUserWidget {
    return {
        id: widget.id,
        widgetId: widget.widgetId,
        isPinned: widget.isPinned,
        isHidden: widget.isHidden,
        customSize: widget.customSize,
        sortOrder: widget.sortOrder,
        widget: {
            id: widget.widget.widget.id,
            key: widget.widget.widget.key,
            name: widget.widget.widget.name,
            description: widget.widget.widget.description ?? '',
            component: widget.widget.widget.component
        },
        roleWidget: {
            id: widget.roleWidget.id,
            roleId: widget.roleWidget.roleId,
            widgetId: widget.roleWidget.widgetId,
            isAssigned: widget.roleWidget.isAssigned,
            sortOrder: widget.roleWidget.sortOrder
        }
    };
}

// -------------------------Tenant Admin panel widgets actions ------------------------------ //

export async function getTenantRoles(tenantSlug: string) {
    const roles = await prisma.role.findMany({
        where: { tenant: { slug: tenantSlug } },
        select: {
            id: true,
            name: true
        }
    });

    const rolesWithColor = roles.map((role, i) => ({
        ...role,
        color: roleColors[i % roleColors.length]
    }));

    return rolesWithColor;
}

export async function updateRoleWidgetAssignmentOld({
    roleId,
    widgetId,
    isAssigned
}: {
    roleId: number
    widgetId: number
    isAssigned: boolean
}): Promise<{ success: boolean; message?: string }> {

    const session = await auth();

    if (!session) {
        redirect('/signin')
    }

    const tenantId = session?.user.tenantId
    const tenantSlug = session?.user.slug

    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Verify the widget belongs to the tenant
            const tenantWidget = await tx.tenantWidget.findFirst({
                where: {
                    widgetId,
                    tenantId
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

                await tx.roleWidget.deleteMany({
                    where: { id: roleWidget.id }
                })
            }

            // revalidatePath(`/${tenantSlug}/admin/widgets`, 'page');
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
                },
                select: {
                    id: true
                }
            });

            if (!tenantWidget) {
                throw new Error('Widget not found for this tenant');
            }

            const tenantWidgetId = tenantWidget.id;

            if (isAssigned) {
                // 2. Only create or update RoleWidget if the widget is being assigned (isAssigned = true)
                const sortOrder = await tx.roleWidget.count({ where: { roleId } });

                const roleWidget = await tx.roleWidget.upsert({
                    where: {
                        roleId_widgetId: {
                            roleId,
                            widgetId: tenantWidgetId
                        }
                    },
                    create: {
                        isAssigned,
                        sortOrder,
                        role: { connect: { id: roleId } },
                        widget: { connect: { id: tenantWidgetId } } // Connect to TenantWidget
                    },
                    update: { isAssigned }
                });

                // 3. Upsert userWidgets in batches
                const users = await tx.user.findMany({
                    where: { roleId },
                    select: { id: true }
                });

                const chunkSize = 20;

                for (let i = 0; i < users.length; i += chunkSize) {
                    const chunk = users.slice(i, i + chunkSize);
                    await Promise.all(
                        chunk.map(user =>
                            tx.userWidget.upsert({
                                where: {
                                    userId_widgetId: {
                                        userId: user.id,
                                        widgetId: tenantWidgetId
                                    }
                                },
                                create: {
                                    isPinned: false,
                                    isHidden: false,
                                    customSize: 'small',
                                    sortOrder: roleWidget.sortOrder,
                                    user: { connect: { id: user.id } },
                                    widget: { connect: { id: tenantWidgetId } },
                                    roleWidget: { connect: { id: roleWidget.id } }
                                },
                                update: {
                                    isHidden: false
                                }
                            })
                        )
                    );
                }

            } else {

                // 4. If unassigning, only delete related userWidget entries, do not create roleWidget
                await tx.userWidget.deleteMany({
                    where: {
                        widgetId: tenantWidgetId,
                        roleWidget: {
                            roleId: roleId
                        }
                    }
                });

                // Optionally, delete the roleWidget if it's no longer needed (when no assignments)
                const roleWidget = await tx.roleWidget.findFirst({
                    where: {
                        roleId,
                        widgetId: tenantWidgetId
                    },
                    select: { id: true }
                });

                if (roleWidget && (await tx.roleWidget.count({ where: { widgetId: tenantWidgetId } })) === 1) {
                    await tx.roleWidget.delete({
                        where: {
                            id: roleWidget.id
                        }
                    });
                }
            }

            // revalidatePath(`/${tenantSlug}/admin/widgets`, 'page');
            return { success: true };
        }, {
            timeout: 15000 // Increase from default 5000ms
        });
    } catch (error) {
        console.error('Error updating role widget assignment:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update assignment'
        };
    }
}
