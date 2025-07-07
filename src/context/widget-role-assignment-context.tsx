"use client"

import { updateRoleWidgetAssignment } from "@/app/actions/widgets"
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"

type Widget = {
    id: number
    name: string
    category: string
    roles: Array<{
        roleId: number
        isAssigned: boolean
    }>
}

type Role = {
    id: number
    name: string
    color: string
}

type ViewMode = "table" | "cards" | "roles"

interface WidgetRoleAssignmentContextType {
    // Data
    widgets: Widget[]
    roles: Role[]

    // UI State
    viewMode: ViewMode
    widgetFilter: string
    roleFilter: string
    selectedCategory: string
    selectedWidgets: number[]
    isUpdating: boolean

    // Computed values
    categories: string[]
    filteredWidgets: Widget[]
    filteredRoles: Role[]

    // Actions
    setViewMode: (mode: ViewMode) => void
    setWidgetFilter: (filter: string) => void
    setRoleFilter: (filter: string) => void
    setSelectedCategory: (category: string) => void
    setSelectedWidgets: (widgets: number[]) => void
    toggleWidgetSelection: (widgetId: number) => void
    toggleAssignment: (widgetId: number, roleId: number, checked: boolean) => void
    bulkAssignToRole: (roleId: number, assign: boolean) => void
    handleSelectAll: (widgets: Widget[]) => void
    handleClearSelection: () => void
    getAssignmentStatus: (widget: Widget, roleId: number) => boolean
    getAssignedRolesCount: (widget: Widget) => number
}

const WidgetRoleAssignmentContext = createContext<WidgetRoleAssignmentContextType | undefined>(undefined)

interface WidgetRoleAssignmentProviderProps {
    children: ReactNode
    initialWidgets: Widget[]
    initialRoles: Role[]
    tenantSlug: string
}

export function WidgetRoleAssignmentProvider({
    children,
    initialWidgets,
    initialRoles,
    tenantSlug

}: WidgetRoleAssignmentProviderProps) {

    const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)
    const [roles] = useState<Role[]>(initialRoles)
    const [widgetFilter, setWidgetFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [selectedWidgets, setSelectedWidgets] = useState<number[]>([])
    const [recentChanges, setRecentChanges] = useState<Record<string, boolean>>({})
    const [isUpdating, setIsUpdating] = useState(false)

    const [viewMode, setViewMode] = useState<ViewMode>("cards")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const categories = ["all", ...Array.from(new Set(widgets.map((w) => w.category)))]

    const filteredWidgets = widgets.filter((widget) => {
        const matchesWidget = widget.name.toLowerCase().includes(widgetFilter.toLowerCase())
        const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
        return matchesWidget && matchesCategory
    })

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

    const handleSelectAll = (widgets: Widget[]) => {
        const widgetIds = widgets.map((w) => w.id)
        const allSelected = widgetIds.every((id) => selectedWidgets.includes(id))

        if (allSelected) {
            setSelectedWidgets(selectedWidgets.filter((id) => !widgetIds.includes(id)))
        } else {
            setSelectedWidgets([...new Set([...selectedWidgets, ...widgetIds])])
        }
    }

    const handleClearSelection = () => {
        setSelectedWidgets([])
    }

    const getAssignmentStatus = (widget: Widget, roleId: number) => {
        return widget.roles.find((r) => r.roleId === roleId)?.isAssigned || false
    }

    const getAssignedRolesCount = (widget: Widget) => {
        return widget.roles.filter((r) => r.isAssigned).length
    }

    const value: WidgetRoleAssignmentContextType = {
        // Data
        widgets,
        roles,

        // UI State
        viewMode,
        widgetFilter,
        roleFilter,
        selectedCategory,
        selectedWidgets,
        isUpdating,

        // Computed values
        categories,
        filteredWidgets,
        filteredRoles,

        // Actions
        setViewMode,
        setWidgetFilter,
        setRoleFilter,
        setSelectedCategory,
        setSelectedWidgets,
        toggleWidgetSelection,
        toggleAssignment,
        bulkAssignToRole,
        handleSelectAll,
        handleClearSelection,
        getAssignmentStatus,
        getAssignedRolesCount,
    }

    return (
        <WidgetRoleAssignmentContext.Provider value={value}>
            {children}
        </WidgetRoleAssignmentContext.Provider>)
}

export function useWidgetRoleAssignment() {
    const context = useContext(WidgetRoleAssignmentContext)
    if (context === undefined) {
        throw new Error("useWidgetRoleAssignment must be used within a WidgetRoleAssignmentProvider")
    }
    return context
}
