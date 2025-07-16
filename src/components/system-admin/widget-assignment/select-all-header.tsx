"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWidgetAssignment } from "@/context/widget-assignment-context"

interface SelectAllHeaderProps {
    widgets: any[]
    title?: string
}

export function SelectAllHeader({ widgets, title = "Select All Widgets" }: SelectAllHeaderProps) {
    const { selectedWidgets, handleSelectAll, handleClearSelection } = useWidgetAssignment()

    const allSelected = widgets.length > 0 && widgets.every((w) => selectedWidgets.includes(w.id))
    const someSelected = widgets.some((w) => selectedWidgets.includes(w.id))

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
                <Checkbox checked={allSelected} onCheckedChange={() => handleSelectAll(widgets)} />
                <span className="font-medium">{title}</span>
                <Badge variant="outline">
                    {widgets.filter((w) => selectedWidgets.includes(w.id)).length}/{widgets.length} selected
                </Badge>
            </div>
            {someSelected && (
                <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                    Clear Selection
                </Button>
            )}
        </div>
    )
}
