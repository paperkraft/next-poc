"use client"
import { SystemWidgetAssignmentProvider, useSystemWidgetAssignment } from "@/context/system-widget-assignment-context"
import { WidgetAssignmentHeader } from "./widget-assignment/header"
import { WidgetAssignmentStats } from "./widget-assignment/stats"
import { WidgetAssignmentFilters } from "./widget-assignment/filters"
import { WidgetAssignmentBulkActions } from "./widget-assignment/bulk-actions"
import { CardsView } from "./widget-assignment/views/cards-view"
import { TableView } from "./widget-assignment/views/table-view"
import { CategoryView } from "./widget-assignment/views/category-view"
import { WidgetAssignmentSaveButton } from "./widget-assignment/save-button"

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

function WidgetAssignmentContent() {
    const { viewMode, allWidgets } = useSystemWidgetAssignment()

    if (allWidgets.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">No widgets found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <WidgetAssignmentHeader />
                <WidgetAssignmentStats />
                <WidgetAssignmentFilters />
            </div>

            <WidgetAssignmentBulkActions />

            <div className="min-h-[400px]">
                {viewMode === "cards" && <CardsView />}
                {viewMode === "table" && <TableView />}
                {viewMode === "category" && <CategoryView />}
            </div>

            <WidgetAssignmentSaveButton />
        </div>
    )
}

export function SystemAdminWidgetAssignmentPanel({
    tenantId,
    allWidgets,
    tenantWidgets = [],
}: {
    tenantId: number
    allWidgets: Widget[]
    tenantWidgets?: TenantWidget[]
}) {
    return (
        <SystemWidgetAssignmentProvider tenantId={tenantId} allWidgets={allWidgets} tenantWidgets={tenantWidgets}>
            <WidgetAssignmentContent />
        </SystemWidgetAssignmentProvider>
    )
}
