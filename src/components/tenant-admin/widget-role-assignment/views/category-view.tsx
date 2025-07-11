"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Package } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { SelectAllHeader } from "../select-all-header"

export function CategoryView() {
    const {
        categories,
        filteredWidgets,
        selectedWidgets,
        selectedRoleData,
        isUpdating,
        handleSelectAll,
        toggleWidgetSelection,
        toggleAssignment,
        getAssignmentStatus,
    } = useWidgetRoleAssignment()

    if (!selectedRoleData) return null

    return (
        <div className="space-y-6">
            <SelectAllHeader widgets={filteredWidgets} />

            {categories
                .filter((cat) => cat !== "all")
                .map((category) => {
                    const categoryWidgets = filteredWidgets.filter((w) => w.category === category)
                    if (categoryWidgets.length === 0) return null

                    const categoryAssigned = categoryWidgets.filter((w) => getAssignmentStatus(w)).length
                    const categorySelected = categoryWidgets.filter((w) => selectedWidgets.includes(w.id)).length

                    return (
                        <Card key={category}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={categorySelected === categoryWidgets.length && categoryWidgets.length > 0}
                                            onCheckedChange={() => handleSelectAll(categoryWidgets)}
                                            disabled={isUpdating}
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
                                        <Badge variant="secondary" className={selectedRoleData.color}>
                                            {categoryAssigned}/{categoryWidgets.length} assigned to {selectedRoleData.name}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categoryWidgets.map((widget) => {
                                        const isAssigned = getAssignmentStatus(widget)
                                        const isSelected = selectedWidgets.includes(widget.id)

                                        return (
                                            <div
                                                key={widget.id}
                                                className={`flex items-start space-x-4 p-4 border rounded-lg ${isSelected ? "ring-2 ring-primary" : ""} ${isAssigned ? "bg-accent/30" : ""}`}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                                    disabled={isUpdating}
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <h4 className="font-medium">{widget.name}</h4>
                                                        <Badge variant={isAssigned ? "default" : "secondary"} className="mt-1">
                                                            {isAssigned ? "Assigned" : "Not Assigned"}
                                                        </Badge>
                                                    </div>

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
