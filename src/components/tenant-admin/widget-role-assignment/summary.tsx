"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentSummary() {
    const { filteredWidgets, widgets, selectedRoleData, getAssignedWidgetsCount } = useWidgetRoleAssignment()

    if (!selectedRoleData) return null

    const assignedCount = getAssignedWidgetsCount()

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {filteredWidgets.length} of {widgets.length} widgets
                    </span>
                    <span>
                        {assignedCount} widgets assigned to {selectedRoleData.name}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
