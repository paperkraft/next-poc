'use client'

import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useWidgetAssignment } from '@/context/WidgetAssignmentContext'

export function WidgetAssignmentPanel() {
    const {
        isUpdating,
        widgets,
        roles,
        widgetFilter,
        roleFilter,
        selectedWidgets,
        recentChanges,
        setWidgetFilter,
        setRoleFilter,
        toggleAssignment,
        toggleWidgetSelection,
        bulkAssignToRole,
        setSelectedWidgets
    } = useWidgetAssignment()

    if (widgets.length === 0 || roles.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No widgets or roles found</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Filter widgets..."
                        value={widgetFilter}
                        onChange={(e) => setWidgetFilter(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        placeholder="Filter roles..."
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    />
                </div>
            </div>

            {selectedWidgets.length > 0 && (
                <div className="flex items-center gap-4 p-3 bg-accent rounded-lg">
                    <span className="text-sm">
                        {selectedWidgets.length} widget(s) selected
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => bulkAssignToRole(roles[0].id, true)}
                        >
                            Assign to {roles[0].name}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => bulkAssignToRole(roles[0].id, false)}
                        >
                            Unassign from {roles[0].name}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWidgets([])}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left w-12">
                                {/* Select all checkbox */}
                            </th>
                            <th className="px-6 py-3 text-left min-w-[200px]">Widget</th>
                            {roles.map((role) => (
                                <th key={role.id} className="px-6 py-3 text-center">
                                    {role.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {widgets.map((widget) => {
                            const isSelected = selectedWidgets.includes(widget.id)
                            return (
                                <tr
                                    key={widget.id}
                                    className={isSelected ? 'bg-accent/50' : undefined}
                                >
                                    <td className="px-6 py-4">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                            disabled={isUpdating}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium">{widget.name}</td>
                                    {roles.map((role) => {
                                        const assignment = widget.roles.find(
                                            (r) => r.roleId === role.id
                                        )
                                        const changeKey = `${widget.id}-${role.id}`
                                        return (
                                            <td
                                                key={role.id}
                                                className={`px-6 py-4 text-center ${recentChanges[changeKey] ? 'bg-primary/10' : ''
                                                    }`}
                                            >
                                                <Switch
                                                    checked={assignment?.isAssigned || false}
                                                    onCheckedChange={(checked) =>
                                                        toggleAssignment(widget.id, role.id, checked)
                                                    }
                                                    disabled={isUpdating}
                                                />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}