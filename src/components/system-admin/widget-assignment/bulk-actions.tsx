"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, X, Star } from "lucide-react"
import { useWidgetAssignment } from "@/context/widget-assignment-context"

export function WidgetAssignmentBulkActions() {
    const { selectedWidgets, isLoading, handleBulkAssign, handleBulkDefault, handleClearSelection } =
        useWidgetAssignment()

    if (selectedWidgets.length === 0) return null

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">{selectedWidgets.length} widget(s) selected</Badge>
                        <Separator orientation="vertical" className="h-6" />
                        <span className="text-sm text-muted-foreground">Bulk actions:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAssign(true)}
                            disabled={isLoading || selectedWidgets.length === 0}
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Assign Selected
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAssign(false)}
                            disabled={isLoading || selectedWidgets.length === 0}
                        >
                            <X className="w-3 h-3 mr-1" />
                            Unassign Selected
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleBulkDefault(true)} disabled={isLoading}>
                            <Star className="w-3 h-3 mr-1" />
                            Set Default
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
