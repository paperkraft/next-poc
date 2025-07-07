"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useSystemWidgetAssignment } from "@/context/system-widget-assignment-context"

export function TableView() {
    const {
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
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead>
                    <tr>
                        <th className="px-4 py-3 text-left w-12">
                            <Checkbox
                                checked={selectedWidgets.length === filteredWidgets.length && filteredWidgets.length > 0}
                                onCheckedChange={() => handleSelectAll(filteredWidgets)}
                                disabled={isLoading}
                            />
                        </th>
                        <th className="px-4 py-3 text-left min-w-[200px]">Widget</th>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-center">Category</th>
                        <th className="px-4 py-3 text-center">Assigned</th>
                        <th className="px-4 py-3 text-center">Default</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {filteredWidgets.map((widget) => {
                        const assignment = getAssignment(widget.id)
                        const isAssigned = assignment?.isAssigned || false
                        const isDefault = assignment?.isDefault || false
                        const isSelected = selectedWidgets.includes(widget.id)

                        return (
                            <tr key={widget.id} className={`${isSelected ? "bg-accent/50" : ""} ${isAssigned ? "bg-accent/20" : ""}`}>
                                <td className="px-4 py-4">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => handleWidgetSelection(widget.id)}
                                        disabled={isLoading}
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">{widget.name}</div>
                                        {isDefault && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                                    {widget.description || "-"}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <Badge variant="outline">{widget.category}</Badge>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <Checkbox
                                        checked={isAssigned}
                                        onCheckedChange={() => handleToggleAssignment(widget.id)}
                                        disabled={isLoading}
                                    />
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <Checkbox
                                        checked={isDefault}
                                        onCheckedChange={() => handleToggleDefault(widget.id)}
                                        disabled={!isAssigned || isLoading}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
