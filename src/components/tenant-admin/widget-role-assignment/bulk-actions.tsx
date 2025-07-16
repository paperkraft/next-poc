"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentBulkActions() {
    const { selectedWidgets, selectedRoleData, isUpdating, bulkAssign, handleClearSelection } = useWidgetRoleAssignment()

    if (selectedWidgets.length === 0 || !selectedRoleData) return null

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">{selectedWidgets.length} widget(s) selected</Badge>
                        <Separator orientation="vertical" className="h-6" />
                        <span className="text-sm text-muted-foreground">
                            Bulk assign to: <Badge className={selectedRoleData.color}>{selectedRoleData.name}</Badge>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => bulkAssign(true)} disabled={isUpdating}>
                            <Check className="w-3 h-3 mr-1" />
                            Assign Selected
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => bulkAssign(false)} disabled={isUpdating}>
                            <X className="w-3 h-3 mr-1" />
                            Unassign Selected
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                            Clear
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
