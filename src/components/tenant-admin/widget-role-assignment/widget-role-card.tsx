"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

interface WidgetRoleCardProps {
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

export function WidgetRoleCard({ widget }: WidgetRoleCardProps) {
    const {
        selectedWidgets,
        filteredRoles,
        roles,
        isUpdating,
        toggleWidgetSelection,
        toggleAssignment,
        getAssignmentStatus,
        getAssignedRolesCount,
    } = useWidgetRoleAssignment()

    const isSelected = selectedWidgets.includes(widget.id)
    const assignedCount = getAssignedRolesCount(widget)

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
                            <CardTitle className="text-base">{widget.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                                {widget.category}
                            </Badge>
                        </div>
                    </div>
                    <Badge variant="secondary">
                        {assignedCount}/{roles.length} roles
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredRoles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between">
                            <Badge variant="outline" className={`${role.color} text-xs`}>
                                {role.name}
                            </Badge>
                            <Switch
                                checked={getAssignmentStatus(widget, role.id)}
                                onCheckedChange={(checked) => toggleAssignment(widget.id, role.id, checked)}
                                disabled={isUpdating}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
