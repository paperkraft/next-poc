"use client"

import { WidgetRoleAssignmentProvider, useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { WidgetRoleAssignmentHeader } from "./widget-role-assignment/header"
import { WidgetRoleAssignmentFilters } from "./widget-role-assignment/filters"
import { WidgetRoleAssignmentBulkActions } from "./widget-role-assignment/bulk-actions"
import { TableView } from "./widget-role-assignment/views/table-view"
import { CardsView } from "./widget-role-assignment/views/cards-view"
import { RolesView } from "./widget-role-assignment/views/roles-view"
import { WidgetRoleAssignmentEmptyState } from "./widget-role-assignment/empty-state"
import { WidgetRoleAssignmentSummary } from "./widget-role-assignment/summary"
import { ReactNode } from "react"

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

function WidgetRoleAssignmentContent() {
    const { viewMode } = useWidgetRoleAssignment()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <WidgetRoleAssignmentHeader />
                <WidgetRoleAssignmentFilters />
            </div>

            <WidgetRoleAssignmentBulkActions />

            <div className="min-h-[360px]">
                {viewMode === "table" && <TableView />}
                {viewMode === "cards" && <CardsView />}
                {viewMode === "roles" && <RolesView />}
                <WidgetRoleAssignmentEmptyState />
            </div>

            <WidgetRoleAssignmentSummary />
        </div>
    )
}

interface WidgetRoleAssignmentPanelProps {
    // children: ReactNode
    initialWidgets: Widget[]
    initialRoles: Role[]
    tenantSlug: string
}

export function WidgetRoleAssignmentPanel(props: WidgetRoleAssignmentPanelProps) {
    return (
        <WidgetRoleAssignmentProvider {...props}>
            <WidgetRoleAssignmentContent />
        </WidgetRoleAssignmentProvider>
    )
}
