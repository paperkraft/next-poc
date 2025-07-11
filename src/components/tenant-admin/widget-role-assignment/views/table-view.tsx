"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { successBadge } from "@/constants/widget"

export function TableView() {
    const {
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
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead>
                    <tr>
                        <th className="px-4 py-3 text-left w-12">
                            <Checkbox
                                checked={selectedWidgets.length === filteredWidgets.length && filteredWidgets.length > 0}
                                onCheckedChange={() => handleSelectAll(filteredWidgets)}
                            />
                        </th>
                        <th className="px-4 py-3 text-left min-w-[200px]">Widget</th>
                        <th className="px-4 py-3 text-center">Category</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">
                            <Badge className={selectedRoleData.color}>{selectedRoleData.name}</Badge>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {filteredWidgets.map((widget) => {
                        const isSelected = selectedWidgets.includes(widget.id)
                        const isAssigned = getAssignmentStatus(widget)

                        return (
                            <tr key={widget.id} className={`${isSelected ? "bg-accent/50" : ""} ${isAssigned ? "bg-accent/20" : ""}`}>
                                <td className="px-4 py-4">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                        disabled={isUpdating}
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">{widget.name}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <Badge variant="outline">{widget.category}</Badge>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <Badge variant={isAssigned ? "default" : "secondary"} className={isAssigned ? successBadge : ""}>
                                        {isAssigned ? "Assigned" : "Not Assigned"}
                                    </Badge>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <Switch
                                        checked={isAssigned}
                                        onCheckedChange={(checked) => toggleAssignment(widget.id, checked)}
                                        disabled={isUpdating}
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
