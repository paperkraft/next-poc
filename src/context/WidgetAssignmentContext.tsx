'use client'

import { updateRoleWidgetAssignment } from '@/app/action/widgets'
import { createContext, useContext, useState, useMemo } from 'react'
import { toast } from 'sonner'

interface Widget {
    id: number
    name: string
    roles: { roleId: number; isAssigned: boolean }[]
}

interface Role {
    id: number
    name: string
}

interface WidgetAssignmentContextType {
    widgets: Widget[]
    roles: Role[]
    tenantSlug: string
    widgetFilter: string
    roleFilter: string
    isUpdating: boolean
    selectedWidgets: number[]
    recentChanges: Record<string, boolean>
    setWidgetFilter: (filter: string) => void
    setRoleFilter: (filter: string) => void
    toggleAssignment: (widgetId: number, roleId: number, isAssigned: boolean) => Promise<void>
    toggleWidgetSelection: (widgetId: number) => void
    bulkAssignToRole: (roleId: number, assign: boolean) => Promise<void>
    setSelectedWidgets: (widgetId: number[]) => void
}

const WidgetAssignmentContext = createContext<WidgetAssignmentContextType | null>(null)

export function WidgetAssignmentProvider({
    initialWidgets,
    initialRoles,
    tenantSlug,
    children
}: {
    initialWidgets: Widget[]
    initialRoles: Role[]
    tenantSlug: string
    children: React.ReactNode
}) {
    const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)
    const [roles] = useState<Role[]>(initialRoles)
    const [widgetFilter, setWidgetFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [selectedWidgets, setSelectedWidgets] = useState<number[]>([])
    const [recentChanges, setRecentChanges] = useState<Record<string, boolean>>({})
    const [isUpdating, setIsUpdating] = useState(false)

    const filteredWidgets = useMemo(() => {
        return widgets.filter(widget =>
            widget.name.toLowerCase().includes(widgetFilter.toLowerCase())
        )
    }, [widgets, widgetFilter])

    const filteredRoles = useMemo(() => {
        return roles.filter(role =>
            role.name.toLowerCase().includes(roleFilter.toLowerCase())
        )
    }, [roles, roleFilter])

    const toggleAssignment = async (widgetId: number, roleId: number, isAssigned: boolean) => {
        setIsUpdating(true)
        try {
            // Optimistic update
            setWidgets(prev =>
                prev.map(widget =>
                    widget.id === widgetId
                        ? {
                            ...widget,
                            roles: widget.roles.map(roleAssignment =>
                                roleAssignment.roleId === roleId
                                    ? { ...roleAssignment, isAssigned }
                                    : roleAssignment
                            )
                        }
                        : widget
                )
            )

            // Highlight recent change
            setRecentChanges(prev => ({
                ...prev,
                [`${widgetId}-${roleId}`]: true
            }))

            // Reset highlight after 2 seconds
            setTimeout(() => {
                setRecentChanges(prev => {
                    const newChanges = { ...prev }
                    delete newChanges[`${widgetId}-${roleId}`]
                    return newChanges
                })
            }, 2000)

            await updateRoleWidgetAssignment({
                tenantSlug,
                roleId,
                widgetId,
                isAssigned
            })

            toast.success(`Widget ${isAssigned ? 'assigned to' : 'unassigned from'} role`)
        } catch (error) {
            // Revert on error
            setWidgets(initialWidgets)
            toast.error('Failed to update assignment')
        } finally {
            setIsUpdating(false)
        }
    }

    const toggleWidgetSelection = (widgetId: number) => {
        setSelectedWidgets(prev =>
            prev.includes(widgetId)
                ? prev.filter(id => id !== widgetId)
                : [...prev, widgetId]
        )
    }

    const bulkAssignToRole = async (roleId: number, assign: boolean) => {
        if (selectedWidgets.length === 0) {
            toast.warning('No widgets selected')
            return
        }

        setIsUpdating(true)
        try {
            // Optimistic update
            setWidgets(prev =>
                prev.map(widget =>
                    selectedWidgets.includes(widget.id)
                        ? {
                            ...widget,
                            roles: widget.roles.map(roleAssignment =>
                                roleAssignment.roleId === roleId
                                    ? { ...roleAssignment, isAssigned: assign }
                                    : roleAssignment
                            )
                        }
                        : widget
                )
            )

            await Promise.all(
                selectedWidgets.map(widgetId =>
                    updateRoleWidgetAssignment({
                        tenantSlug,
                        roleId,
                        widgetId,
                        isAssigned: assign
                    })
                )
            )

            toast.success(`Bulk ${assign ? 'assigned' : 'unassigned'} ${selectedWidgets.length} widgets`)
            setSelectedWidgets([])
        } catch (error) {
            setWidgets(initialWidgets)
            toast.error('Failed to bulk update assignments')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <WidgetAssignmentContext.Provider
            value={{
                widgets: filteredWidgets,
                roles: filteredRoles,
                isUpdating,
                tenantSlug,
                widgetFilter,
                roleFilter,
                selectedWidgets,
                recentChanges,
                setWidgetFilter,
                setRoleFilter,
                toggleAssignment,
                toggleWidgetSelection,
                bulkAssignToRole,
                setSelectedWidgets
            }}
        >
            {children}
        </WidgetAssignmentContext.Provider>
    )
}

export const useWidgetAssignment = () => {
    const context = useContext(WidgetAssignmentContext)
    if (!context) {
        throw new Error('useWidgetAssignment must be used within a WidgetAssignmentProvider')
    }
    return context
}