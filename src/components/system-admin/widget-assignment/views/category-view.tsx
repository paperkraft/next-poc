"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Star } from "lucide-react"
import { useSystemWidgetAssignment } from "@/context/system-widget-assignment-context"
import { SelectAllHeader } from "../select-all-header"

export function CategoryView() {
    const {
        categories,
        filteredWidgets,
        selectedWidgets,
        isLoading,
        getAssignment,
        handleSelectAll,
        handleWidgetSelection,
        handleToggleAssignment,
        handleToggleDefault,
    } = useSystemWidgetAssignment()

    return (
        <div className="space-y-6">
            <SelectAllHeader widgets={filteredWidgets} />

            {categories
                .filter((cat) => cat !== "all")
                .map((category) => {
                    const categoryWidgets = filteredWidgets.filter((w) => w.category === category)
                    if (categoryWidgets.length === 0) return null

                    const categoryAssigned = categoryWidgets.filter((w) => getAssignment(w.id)?.isAssigned).length
                    const categorySelected = categoryWidgets.filter((w) => selectedWidgets.includes(w.id)).length

                    return (
                        <Card key={category}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={categorySelected === categoryWidgets.length && categoryWidgets.length > 0}
                                            onCheckedChange={() => handleSelectAll(categoryWidgets)}
                                            disabled={isLoading}
                                        />
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            {category}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {categorySelected}/{categoryWidgets.length} selected
                                        </Badge>
                                        <Badge variant="secondary">
                                            {categoryAssigned}/{categoryWidgets.length} assigned
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categoryWidgets.map((widget) => {
                                        const assignment = getAssignment(widget.id)
                                        const isAssigned = assignment?.isAssigned || false
                                        const isDefault = assignment?.isDefault || false
                                        const isSelected = selectedWidgets.includes(widget.id)

                                        return (
                                            <div
                                                key={widget.id}
                                                className={`flex items-start space-x-4 p-4 border rounded-lg ${isSelected ? "ring-2 ring-primary" : ""} ${isAssigned ? "bg-accent/30" : ""}`}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleWidgetSelection(widget.id)}
                                                    disabled={isLoading}
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium">{widget.name}</h4>
                                                            {isDefault && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                                                        </div>
                                                        {widget.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">{widget.description}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`assign-${widget.id}`}
                                                                checked={isAssigned}
                                                                onCheckedChange={() => handleToggleAssignment(widget.id)}
                                                                disabled={isLoading}
                                                            />
                                                            <label htmlFor={`assign-${widget.id}`} className="text-sm font-medium">
                                                                Assign
                                                            </label>
                                                        </div>

                                                        {isAssigned && (
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`default-${widget.id}`}
                                                                    checked={isDefault}
                                                                    onCheckedChange={() => handleToggleDefault(widget.id)}
                                                                    disabled={isLoading}
                                                                />
                                                                <label htmlFor={`default-${widget.id}`} className="text-sm font-medium">
                                                                    Default
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
        </div>
    )
}
