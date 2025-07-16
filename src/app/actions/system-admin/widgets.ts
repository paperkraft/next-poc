"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTenantWidgets(tenantId: number) {
    try {
        // Get all available widgets
        const allWidgets = await prisma.widget.findMany({
            orderBy: { name: 'asc' }
        })

        // Get widgets assigned to this tenant with their assignment details
        const tenantWidgets = await prisma.tenantWidget.findMany({
            where: { tenantId },
            include: { widget: true },
            orderBy: { widget: { name: 'asc' } }
        })

        return {
            allWidgets,
            tenantWidgets: tenantWidgets.map(tw => ({
                ...tw.widget,
                isDefault: tw.isDefault,
                assignmentId: tw.id
            }))
        }
    } catch (error) {
        console.error("Error fetching tenant widgets:", error)
        throw error
    }
}

export async function updateTenantWidgetAssignments({
    tenantId,
    assignments
}: {
    tenantId: number
    assignments: {
        widgetId: number
        shouldAssign: boolean
        isDefault?: boolean
    }[]
}) {
    try {
        await prisma.$transaction(async (tx) => {
            for (const { widgetId, shouldAssign, isDefault } of assignments) {
                if (shouldAssign) {
                    // Upsert the assignment
                    await tx.tenantWidget.upsert({
                        where: {
                            tenantId_widgetId: {
                                tenantId,
                                widgetId
                            }
                        },
                        create: {
                            tenantId,
                            widgetId,
                            isDefault: isDefault || false
                        },
                        update: {
                            isDefault: isDefault || false
                        }
                    })
                } else {
                    // Remove the assignment if it exists
                    await tx.tenantWidget.deleteMany({
                        where: {
                            tenantId,
                            widgetId
                        }
                    })
                }
            }
        })

        revalidatePath(`/admin/tenants/${tenantId}/widgets`)
        return { success: true, message: "Widget assignments updated successfully" }
    } catch (error) {
        console.error("Error updating widget assignments:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to update widget assignments"
        }
    }
}