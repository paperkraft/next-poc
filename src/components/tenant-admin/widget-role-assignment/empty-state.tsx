"use client"

import { Users, ArrowDown } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentEmptyState() {
    const { selectedRole, filteredWidgets } = useWidgetRoleAssignment()

    if (!selectedRole) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowDown className="w-5 h-5" />
                    <Users className="w-5 h-5" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium">Select a Role to Begin</p>
                    <p className="text-muted-foreground">Choose a role from the dropdown above to manage widget assignments</p>
                </div>
            </div>
        )
    }

    if (filteredWidgets.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No widgets found matching your filters</p>
            </div>
        )
    }

    return null
}