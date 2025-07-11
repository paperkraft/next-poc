"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { successBadge } from "@/constants/widget"

interface WidgetCardProps {
    widget: {
        id: number
        name: string
        category: string
        roles: Array<{
            roleId: number
            isAssigned: boolean
        }>
    }
}

export function WidgetCard({ widget }: WidgetCardProps) {
    const {
        selectedWidgets,
        selectedRoleData,
        isUpdating,
        toggleWidgetSelection,
        toggleAssignment,
        getAssignmentStatus,
    } = useWidgetRoleAssignment()

    const isSelected = selectedWidgets.includes(widget.id)
    const isAssigned = getAssignmentStatus(widget)

    if (!selectedRoleData) return null

    return (
        <Card className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleWidgetSelection(widget.id)}
                            disabled={isUpdating}
                        />
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                {widget.name}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">
                                {widget.category}
                            </Badge>
                        </div>
                    </div>
                    <Badge variant={isAssigned ? "default" : "secondary"} className={isAssigned ? successBadge : ""}>
                        {isAssigned ? "Assigned" : "Not Assigned"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Assign to</span>
                        <Badge className={selectedRoleData.color}>{selectedRoleData.name}</Badge>
                    </div>
                    <Switch
                        checked={isAssigned}
                        onCheckedChange={(checked) => toggleAssignment(widget.id, checked)}
                        disabled={isUpdating}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
