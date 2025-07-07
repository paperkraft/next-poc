"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentSummary() {
    const { filteredWidgets, widgets, filteredRoles } = useWidgetRoleAssignment()

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {filteredWidgets.length} of {widgets.length} widgets
                    </span>
                    <span>{filteredRoles.length} roles configured</span>
                </div>
            </CardContent>
        </Card>
    )
}
