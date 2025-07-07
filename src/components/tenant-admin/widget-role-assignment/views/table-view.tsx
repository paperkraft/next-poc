"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function TableView() {
    const {
        filteredWidgets,
        filteredRoles,
        selectedWidgets,
        isUpdating,
        handleSelectAll,
        toggleWidgetSelection,
        toggleAssignment,
        getAssignmentStatus,
    } = useWidgetRoleAssignment()

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
                        <th className="px-4 py-3 text-left min-w-[200px] sticky left-0 bg-background">Widget</th>
                        {filteredRoles.map((role) => (
                            <th key={role.id} className="px-4 py-3 text-center min-w-[120px]">
                                <Badge variant="secondary" className={role.color}>
                                    {role.name}
                                </Badge>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {filteredWidgets.map((widget) => {
                        const isSelected = selectedWidgets.includes(widget.id)
                        return (
                            <tr key={widget.id} className={isSelected ? "bg-accent/50" : undefined}>
                                <td className="px-4 py-4">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                        disabled={isUpdating}
                                    />
                                </td>
                                <td className="px-4 py-4 sticky left-0 bg-background">
                                    <div>
                                        <div className="font-medium">{widget.name}</div>
                                        <div className="text-sm text-muted-foreground">{widget.category}</div>
                                    </div>
                                </td>
                                {filteredRoles.map((role) => (
                                    <td key={role.id} className="px-4 py-4 text-center">
                                        <Switch
                                            checked={getAssignmentStatus(widget, role.id)}
                                            onCheckedChange={(checked) => toggleAssignment(widget.id, role.id, checked)}
                                            disabled={isUpdating}
                                        />
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
