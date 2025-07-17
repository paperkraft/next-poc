"use client"

import { updateRoleWidgetAssignment } from "@/app/actions/widgets.action"
import { Role, Widget } from "@/components/tenant-admin/widget-role-assignment/role-assignment-types"
import { createContext, useContext, useCallback, useState, useMemo, type ReactNode } from "react"
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
    allSelected: boolean

    // Actions
    setViewMode: (mode: ViewMode) => void
    setWidgetFilter: (filter: string) => void
    setSelectedCategory: (category: string) => void
    setSelectedWidgets: (widgets: number[]) => void
    setSelectedRole: (roleId: number | null) => void
    toggleWidgetSelection: (widgetId: number) => void
    toggleAssignment: (widgetId: number, checked: boolean) => void
    bulkAssign: (assign: boolean) => Promise<void>
    handleSelectAll: (widgets: Widget[]) => void
    handleClearSelection: () => void
    getAssignmentStatus: (widget: Widget) => boolean
    getAssignedWidgetsCount: () => number
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

    // Memoized computed values
    const categories = useMemo(() =>
        ["all", ...new Set(widgets.map(w => w.category))],
        [widgets]
    )

    const filteredWidgets = useMemo(() =>
        widgets.filter(widget => {
            const matchesWidget = widget.name.toLowerCase().includes(widgetFilter.toLowerCase())
            const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
            return matchesWidget && matchesCategory
        }),
        [widgets, widgetFilter, selectedCategory]
    )

    const selectedRoleData = useMemo(() =>
        selectedRole ? roles.find(r => r.id === selectedRole) || null : null,
        [roles, selectedRole]
    )

    const allSelected = useMemo(() =>
        filteredWidgets.length > 0 &&
        filteredWidgets.every(w => selectedWidgets.includes(w.id)),
        [filteredWidgets, selectedWidgets]
    )

    // Memoized handlers
    const handleSelectAll = useCallback((widgetsToSelect: Widget[]) => {
        const widgetIds = widgetsToSelect.map(w => w.id)
        setSelectedWidgets(prev =>
            prev.length === widgetIds.length ? [] : [...new Set([...widgetIds])]
        )
    }, [])

    const handleClearSelection = useCallback(() => {
        setSelectedWidgets([])
    }, [])

    const getAssignmentStatus = useCallback((widget: Widget) => {
        if (!selectedRole) return false
        return widget.roles.some(r => r.roleId === selectedRole && r.isAssigned)
    }, [selectedRole])

    const getAssignedWidgetsCount = useCallback(() =>
        selectedRole ?
            widgets.filter(w => w.roles.some(r => r.roleId === selectedRole && r.isAssigned)).length :
            0,
        [widgets, selectedRole]
    )

    const updateWidgetsState = useCallback((widgetIds: number[], isAssigned: boolean) => {
        if (!selectedRole) return

        setWidgets(prev => prev.map(widget =>
            widgetIds.includes(widget.id) ? {
                ...widget,
                roles: widget.roles.map(role =>
                    role.roleId === selectedRole ? { ...role, isAssigned } : role
                )
            } : widget
        ))
    }, [selectedRole])

    const toggleWidgetSelection = useCallback((widgetId: number) => {
        setSelectedWidgets(prev =>
            prev.includes(widgetId) ?
                prev.filter(id => id !== widgetId) :
                [...prev, widgetId]
        )
    }, [])

    const handleToggleAssignment = useCallback(async (widgetId: number, checked: boolean) => {
        if (!selectedRole) return

        setIsUpdating(true)
        try {
            await updateRoleWidgetAssignment({
                tenantSlug,
                roleId: selectedRole,
                widgetId,
                isAssigned: checked
            })

            updateWidgetsState([widgetId], checked)
            toast.success(`Widget assignment updated`)
        } catch (error) {
            toast.error("Failed to update assignment")
        } finally {
            setIsUpdating(false)
        }
    }, [selectedRole, tenantSlug, updateWidgetsState])

    const bulkAssign = useCallback(async (assign: boolean) => {
        if (!selectedRole || selectedWidgets.length === 0) return

        setIsUpdating(true)
        try {
            // Use bulk API endpoint instead of individual calls
            selectedWidgets.forEach(async (widgetId) => {
                await updateRoleWidgetAssignment({
                    tenantSlug,
                    roleId: selectedRole,
                    widgetId,
                    isAssigned: assign
                })
            });

            updateWidgetsState(selectedWidgets, assign)
            toast.success(`${selectedWidgets.length} widgets ${assign ? 'assigned' : 'unassigned'}`)
            setSelectedWidgets([])
        } catch (error) {
            toast.error(`Failed to ${assign ? 'assign' : 'unassign'} widgets`)
        } finally {
            setIsUpdating(false)
        }
    }, [selectedRole, selectedWidgets, tenantSlug, updateWidgetsState])

    const value = useMemo(() => ({
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
        allSelected,

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
    }), [
        widgets,
        roles,
        viewMode,
        widgetFilter,
        selectedCategory,
        selectedWidgets,
        selectedRole,
        isUpdating,
        categories,
        filteredWidgets,
        selectedRoleData,
        allSelected,
        toggleWidgetSelection,
        handleToggleAssignment,
        bulkAssign,
        handleSelectAll,
        handleClearSelection,
        getAssignmentStatus,
        getAssignedWidgetsCount
    ])

    return (
        <WidgetRoleAssignmentContext.Provider value={value}>
            {children}
        </WidgetRoleAssignmentContext.Provider>
    )
}

export function useWidgetRoleAssignment() {
    const context = useContext(WidgetRoleAssignmentContext)
    if (context === undefined) {
        throw new Error("useWidgetRoleAssignment must be used within a WidgetRoleAssignmentProvider")
    }
    return context
}