"use client"

import { updateRoleWidgetAssignment } from "@/app/actions/widgets"
import { Role, Widget } from "@/components/tenant-admin/widget-role-assignment/role-assignment-types"
import { createContext, useContext, useState, type ReactNode } from "react"
import { toast } from "sonner"

type ViewMode = "table" | "cards" | "category"

interface WidgetRoleAssignmentContextType {
    // Data
    widgets: Widget[]
    roles: Role[]

    // UI State
    viewMode: ViewMode
    widgetFilter: string
    selectedCategory: string
    selectedWidgets: number[]
    selectedRole: number | null
    isUpdating: boolean

    // Computed values
    categories: string[]
    filteredWidgets: Widget[]
    selectedRoleData: Role | null

    // Actions
    setViewMode: (mode: ViewMode) => void
    setWidgetFilter: (filter: string) => void
    setSelectedCategory: (category: string) => void
    setSelectedWidgets: (widgets: number[]) => void
    setSelectedRole: (roleId: number | null) => void
    toggleWidgetSelection: (widgetId: number) => void
    toggleAssignment: (widgetId: number, checked: boolean) => void
    bulkAssign: (assign: boolean) => void
    handleSelectAll: (widgets: Widget[]) => void
    handleClearSelection: () => void
    getAssignmentStatus: (widget: Widget) => boolean
    getAssignedWidgetsCount: () => number
    updateWidgetAssignment: (widgetId: number, roleId: number, isAssigned: boolean) => void
    updateMultipleWidgetAssignments: (widgetIds: number[], roleId: number, isAssigned: boolean) => void
}

const WidgetRoleAssignmentContext = createContext<WidgetRoleAssignmentContextType | undefined>(undefined)

interface WidgetRoleAssignmentProviderProps {
    children: ReactNode
    initialWidgets: Widget[]
    roles: Role[]
    tenantSlug: string
}

export function WidgetRoleAssignmentProvider({
    children,
    initialWidgets,
    roles,
    tenantSlug
}: WidgetRoleAssignmentProviderProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("cards")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [widgetFilter, setWidgetFilter] = useState("")
    const [selectedWidgets, setSelectedWidgets] = useState<number[]>([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)

    const categories = ["all", ...Array.from(new Set(widgets.map((w) => w.category)))]

    const filteredWidgets = widgets.filter((widget) => {
        const matchesWidget = widget.name.toLowerCase().includes(widgetFilter.toLowerCase())
        const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
        return matchesWidget && matchesCategory
    })

    const selectedRoleData = selectedRole ? roles.find((r) => r.id === selectedRole) || null : null

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

    const getAssignmentStatus = (widget: Widget) => {
        if (!selectedRole) return false
        return widget.roles.find((r) => r.roleId === selectedRole)?.isAssigned || false
    }

    const getAssignedWidgetsCount = () => {
        if (!selectedRole) return 0
        return filteredWidgets.filter((widget) => getAssignmentStatus(widget)).length
    }

    const updateWidgetAssignment = (widgetId: number, roleId: number, isAssigned: boolean) => {
        setWidgets((prevWidgets) =>
            prevWidgets.map((widget) => {
                if (widget.id === widgetId) {
                    return {
                        ...widget,
                        roles: widget.roles.map((role) => (role.roleId === roleId ? { ...role, isAssigned } : role)),
                    }
                }
                return widget
            }),
        )
    }

    const updateMultipleWidgetAssignments = (widgetIds: number[], roleId: number, isAssigned: boolean) => {
        setWidgets((prevWidgets) =>
            prevWidgets.map((widget) => {
                if (widgetIds.includes(widget.id)) {
                    return {
                        ...widget,
                        roles: widget.roles.map((role) => (role.roleId === roleId ? { ...role, isAssigned } : role)),
                    }
                }
                return widget
            }),
        )
    }

    const handleToggleAssignment = async (widgetId: number, checked: boolean) => {
        if (!selectedRole) return
        // toggleAssignment(widgetId, selectedRole, checked)
        setIsUpdating(true)
        try {
            // Simulate API call
            await updateRoleWidgetAssignment({
                tenantSlug,
                roleId: selectedRole,
                widgetId,
                isAssigned: checked
            })

            // Update local state immediately
            updateWidgetAssignment(widgetId, selectedRole, checked)
            toast.success(`Updated widget ${widgetId} assignment for role ${selectedRole}: ${checked}`)
        } catch (error) {
            toast.error("Failed to update assignment")
        } finally {
            setIsUpdating(false)
        }
    }

    const bulkAssign = async (assign: boolean) => {
        if (!selectedRole || selectedWidgets.length === 0) return

        setIsUpdating(true)
        try {
            // Simulate API call
            await Promise.all(
                selectedWidgets.map(widgetId =>
                    updateRoleWidgetAssignment({
                        tenantSlug,
                        roleId: selectedRole,
                        widgetId,
                        isAssigned: assign
                    })
                )
            )

            // Update local state immediately
            updateMultipleWidgetAssignments(selectedWidgets, selectedRole, assign)

            console.log(`Bulk ${assign ? "assigned" : "unassigned"} widgets ${selectedWidgets} for role ${selectedRole}`)
            toast.success(`Bulk ${assign ? "assigned" : "unassigned"} widgets ${selectedWidgets} for role ${selectedRole}`)

            // Clear selection after bulk operation
            setSelectedWidgets([])
        } catch (error) {
            toast.error("Failed to bulk update assignments:")
        } finally {
            setIsUpdating(false)
        }
    }

    const toggleWidgetSelection = (widgetId: number) => {
        setSelectedWidgets((prev) => (prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId]))
    }

    const value: WidgetRoleAssignmentContextType = {
        // Data
        widgets,
        roles,

        // UI State
        viewMode,
        widgetFilter,
        selectedCategory,
        selectedWidgets,
        selectedRole,
        isUpdating,

        // Computed values
        categories,
        filteredWidgets,
        selectedRoleData,

        // Actions
        setViewMode,
        setWidgetFilter,
        setSelectedCategory,
        setSelectedWidgets,
        setSelectedRole,
        toggleWidgetSelection,
        toggleAssignment: handleToggleAssignment,
        bulkAssign,
        handleSelectAll,
        handleClearSelection,
        getAssignmentStatus,
        getAssignedWidgetsCount,
        updateWidgetAssignment,
        updateMultipleWidgetAssignments,
    }

    return <WidgetRoleAssignmentContext.Provider value={value}>{children}</WidgetRoleAssignmentContext.Provider>
}

export function useWidgetRoleAssignment() {
    const context = useContext(WidgetRoleAssignmentContext)
    if (context === undefined) {
        throw new Error("useWidgetRoleAssignment must be used within a WidgetRoleAssignmentProvider")
    }
    return context
}