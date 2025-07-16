"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useWidgetAssignment } from "@/context/widget-assignment-context"

interface WidgetCardProps {
    widget: {
        id: number
        name: string
        description?: string | null
        category: string
    }
}

export function WidgetCard({ widget }: WidgetCardProps) {
    const {
        selectedWidgets,
        isLoading,
        getAssignment,
        handleWidgetSelection,
        handleToggleAssignment,
        handleToggleDefault,
    } = useWidgetAssignment()

    const assignment = getAssignment(widget.id)
    const isAssigned = assignment?.isAssigned || false
    const isDefault = assignment?.isDefault || false
    const isSelected = selectedWidgets.includes(widget.id)

    return (
        <Card className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""} ${isAssigned ? "bg-accent/30" : ""}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleWidgetSelection(widget.id)}
                            disabled={isLoading}
                        />
                        <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                                {widget.name}
                                {isDefault && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">
                                {widget.category}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        {isAssigned && (
                            <Badge variant="secondary" className="text-xs">
                                Assigned
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {widget.description && <p className="text-sm text-muted-foreground">{widget.description}</p>}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label htmlFor={`assign-${widget.id}`} className="text-sm font-medium">
                            Assign Widget
                        </label>
                        <Checkbox
                            id={`assign-${widget.id}`}
                            checked={isAssigned}
                            onCheckedChange={() => handleToggleAssignment(widget.id)}
                            disabled={isLoading}
                        />
                    </div>

                    {isAssigned && (
                        <div className="flex items-center justify-between pt-2 border-t">
                            <label htmlFor={`default-${widget.id}`} className="text-sm font-medium flex items-center gap-2">
                                <Star className="w-3 h-3" />
                                Set as Default
                            </label>
                            <Checkbox
                                id={`default-${widget.id}`}
                                checked={isDefault}
                                onCheckedChange={() => handleToggleDefault(widget.id)}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
