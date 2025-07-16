"use client"

import { updateTenantWidgetAssignments } from "@/app/actions/system-admin/widgets"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

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

type Assignment = {
    widgetId: number
    isAssigned: boolean
    isDefault: boolean
}

type ViewMode = "cards" | "table" | "category"

interface WidgetAssignmentContextType {
    // Data
    tenantId: number
    allWidgets: Widget[]
    tenantWidgets: TenantWidget[]
    assignments: Assignment[]

    // UI State
    viewMode: ViewMode
    searchFilter: string
    categoryFilter: string
    selectedWidgets: number[]
    isLoading: boolean

    // Computed values
    categories: string[]
    filteredWidgets: Widget[]
    assignedCount: number
    defaultCount: number

    // Actions
    setViewMode: (mode: ViewMode) => void
    setSearchFilter: (filter: string) => void
    setCategoryFilter: (category: string) => void
    setSelectedWidgets: (widgets: number[]) => void
    handleToggleAssignment: (widgetId: number) => void
    handleToggleDefault: (widgetId: number) => void
    handleWidgetSelection: (widgetId: number) => void
    handleBulkAssign: (assign: boolean) => void
    handleBulkDefault: (setDefault: boolean) => void
    handleSelectAll: (widgets: Widget[]) => void
    handleClearSelection: () => void
    handleSave: () => Promise<void>
    getAssignment: (widgetId: number) => Assignment | undefined
}

const WidgetAssignmentContext = createContext<WidgetAssignmentContextType | undefined>(undefined)

interface WidgetAssignmentProviderProps {
    children: ReactNode
    tenantId: number
    allWidgets: Widget[]
    tenantWidgets?: TenantWidget[]
}

export function WidgetAssignmentProvider({
    children,
    tenantId,
    allWidgets,
    tenantWidgets = [],
}: WidgetAssignmentProviderProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("cards")
    const [searchFilter, setSearchFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [selectedWidgets, setSelectedWidgets] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [assignments, setAssignments] = useState<Assignment[]>([])

    const categories = ["all", ...Array.from(new Set(allWidgets.map((w) => w.category)))]

    const filteredWidgets = allWidgets.filter((widget) => {
        const matchesSearch =
            widget.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            widget.description?.toLowerCase().includes(searchFilter.toLowerCase())
        const matchesCategory = categoryFilter === "all" || widget.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const assignedCount = assignments.filter((a) => a.isAssigned).length
    const defaultCount = assignments.filter((a) => a.isDefault).length

    useEffect(() => {
        setAssignments(
            allWidgets.map((widget) => {
                const tenantWidget = tenantWidgets.find((tw) => tw.id === widget.id)
                return {
                    widgetId: widget.id,
                    isAssigned: !!tenantWidget,
                    isDefault: tenantWidget?.isDefault || false,
                }
            }),
        )
    }, [allWidgets, tenantWidgets])

    const handleToggleAssignment = (widgetId: number) => {
        setAssignments((prev) =>
            prev.map((item) =>
                item.widgetId === widgetId
                    ? { ...item, isAssigned: !item.isAssigned, isDefault: !item.isAssigned ? false : item.isDefault }
                    : item,
            ),
        )
    }

    const handleToggleDefault = (widgetId: number) => {
        setAssignments((prev) =>
            prev.map((item) => (item.widgetId === widgetId ? { ...item, isDefault: !item.isDefault } : item)),
        )
    }

    const handleWidgetSelection = (widgetId: number) => {
        setSelectedWidgets((prev) => (prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId]))
    }

    const handleBulkAssign = (assign: boolean) => {
        setAssignments((prev) =>
            prev.map((item) => {
                if (selectedWidgets.includes(item.widgetId)) {
                    return {
                        ...item,
                        isAssigned: assign,
                        isDefault: assign ? item.isDefault : false,
                    }
                }
                return item
            }),
        )
        setSelectedWidgets([])
    }

    const handleBulkDefault = (setDefault: boolean) => {
        setAssignments((prev) =>
            prev.map((item) => {
                if (selectedWidgets.includes(item.widgetId) && item.isAssigned) {
                    return { ...item, isDefault: setDefault }
                }
                return item
            }),
        )
        setSelectedWidgets([])
    }

    const handleSelectAll = (widgets: Widget[]) => {
        const widgetIds = widgets.map((w) => w.id)
        const allSelected = widgetIds.every((id) => selectedWidgets.includes(id))

        if (allSelected) {
            setSelectedWidgets((prev) => prev.filter((id) => !widgetIds.includes(id)))
        } else {
            setSelectedWidgets((prev) => [...new Set([...prev, ...widgetIds])])
        }
    }

    const handleClearSelection = () => {
        setSelectedWidgets([])
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await updateTenantWidgetAssignments({
                tenantId,
                assignments: assignments.map((a) => ({
                    widgetId: a.widgetId,
                    shouldAssign: a.isAssigned,
                    isDefault: a.isDefault,
                })),
            })
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to update widget assignments")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getAssignment = (widgetId: number) => {
        return assignments.find((a) => a.widgetId === widgetId)
    }

    const value: WidgetAssignmentContextType = {
        // Data
        tenantId,
        allWidgets,
        tenantWidgets,
        assignments,

        // UI State
        viewMode,
        searchFilter,
        categoryFilter,
        selectedWidgets,
        isLoading,

        // Computed values
        categories,
        filteredWidgets,
        assignedCount,
        defaultCount,

        // Actions
        setViewMode,
        setSearchFilter,
        setCategoryFilter,
        setSelectedWidgets,
        handleToggleAssignment,
        handleToggleDefault,
        handleWidgetSelection,
        handleBulkAssign,
        handleBulkDefault,
        handleSelectAll,
        handleClearSelection,
        handleSave,
        getAssignment,
    }

    return (
        <WidgetAssignmentContext.Provider value={value}>
            {children}
        </WidgetAssignmentContext.Provider>
    )
}

export function useWidgetAssignment() {
    const context = useContext(WidgetAssignmentContext)
    if (context === undefined) {
        throw new Error("useWidgetAssignment must be used within a SystemWidgetAssignmentProvider")
    }
    return context
}
