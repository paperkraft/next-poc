'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { updateTenantWidgetAssignments } from '@/app/action/tenant-widgets'

type Widget = {
    id: number
    name: string
    description?: string | null
    component: string
    category: string
}

type TenantWidget = Widget & {
    isDefault: boolean
    assignmentId?: number
}

export function AdminWidgetAssignmentPanel({
    tenantId,
    allWidgets,
    tenantWidgets = []
}: {
    tenantId: number
    allWidgets: Widget[]
    tenantWidgets?: TenantWidget[]
}) {
    const [assignments, setAssignments] = useState<
        {
            widgetId: number
            isAssigned: boolean
            isDefault: boolean
        }[]
    >([])

    useEffect(() => {
        setAssignments(
            allWidgets.map(widget => {
                const tenantWidget = tenantWidgets.find(tw => tw.id === widget.id)
                return {
                    widgetId: widget.id,
                    isAssigned: !!tenantWidget,
                    isDefault: tenantWidget?.isDefault || false
                }
            })
        )
    }, [allWidgets, tenantWidgets])

    const handleToggleAssignment = (widgetId: number) => {
        setAssignments(prev =>
            prev.map(item =>
                item.widgetId === widgetId
                    ? { ...item, isAssigned: !item.isAssigned, isDefault: !item.isAssigned ? false : item.isDefault }
                    : item
            )
        )
    }

    const handleToggleDefault = (widgetId: number) => {
        setAssignments(prev =>
            prev.map(item =>
                item.widgetId === widgetId
                    ? { ...item, isDefault: !item.isDefault }
                    : item
            ))
    }

    const handleSave = async () => {
        try {
            const result = await updateTenantWidgetAssignments({
                tenantId,
                assignments: assignments.map(a => ({
                    widgetId: a.widgetId,
                    shouldAssign: a.isAssigned,
                    isDefault: a.isDefault
                }))
            })

            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('Failed to update widget assignments')
            console.error(error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allWidgets.map(widget => {
                    const assignment = assignments.find(a => a.widgetId === widget.id)
                    const isAssigned = assignment?.isAssigned || false
                    const isDefault = assignment?.isDefault || false

                    return (
                        <div
                            key={widget.id}
                            className={`flex items-start space-x-4 p-4 border rounded-lg ${isAssigned ? 'bg-muted/50' : ''
                                }`}
                        >
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`assign-${widget.id}`}
                                        checked={isAssigned}
                                        onCheckedChange={() => handleToggleAssignment(widget.id)}
                                    />
                                    <label
                                        htmlFor={`assign-${widget.id}`}
                                        className="font-medium leading-none"
                                    >
                                        {widget.name}
                                    </label>
                                </div>
                                {widget.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {widget.description}
                                    </p>
                                )}
                                {isAssigned && (
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id={`default-${widget.id}`}
                                            checked={isDefault}
                                            onCheckedChange={() => handleToggleDefault(widget.id)}
                                        />
                                        <label
                                            htmlFor={`default-${widget.id}`}
                                            className="text-sm font-medium leading-none"
                                        >
                                            Set as default
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <Button onClick={handleSave}>Save Assignments</Button>
        </div>
    )
}