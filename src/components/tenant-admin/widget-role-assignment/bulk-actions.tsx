"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Check, X } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentBulkActions() {
    const { selectedWidgets, filteredRoles, isUpdating, bulkAssignToRole, handleClearSelection } =
        useWidgetRoleAssignment()

    if (selectedWidgets.length === 0) return null

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">{selectedWidgets.length} widget(s) selected</Badge>
                        <Separator orientation="vertical" className="h-6" />
                        <span className="text-sm text-muted-foreground">Bulk assign to:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ScrollArea className="w-96">
                            <div className="flex items-center gap-2 pb-2">
                                {filteredRoles.map((role) => (
                                    <div key={role.id} className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => bulkAssignToRole(role.id, true)}
                                            disabled={isUpdating}
                                            className="whitespace-nowrap"
                                        >
                                            <Check className="w-3 h-3 mr-1" />
                                            {role.name}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => bulkAssignToRole(role.id, false)}
                                            disabled={isUpdating}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                            Clear
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
