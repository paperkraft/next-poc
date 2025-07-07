"use client"

import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentEmptyState() {
    const { filteredWidgets, filteredRoles } = useWidgetRoleAssignment()

    if (filteredWidgets.length > 0 && filteredRoles.length > 0) return null

    return (
        <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No widgets or roles found</p>
        </div>
    )
}
