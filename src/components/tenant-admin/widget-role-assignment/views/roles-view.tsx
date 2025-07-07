"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { SelectAllHeader } from "../select-all-header"

export function RolesView() {
    const {
        filteredWidgets,
        filteredRoles,
        selectedWidgets,
        isUpdating,
        toggleWidgetSelection,
        toggleAssignment,
        getAssignmentStatus,
    } = useWidgetRoleAssignment()

    return (
        <div className="space-y-4">
            <SelectAllHeader widgets={filteredWidgets} />
            <Accordion type="multiple" className="w-full">
                {filteredRoles.map((role) => {
                    const assignedWidgets = filteredWidgets.filter((widget) => getAssignmentStatus(widget, role.id))
                    return (
                        <AccordionItem key={role.id} value={`${role.id}`}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <Badge className={role.color}>{role.name}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {assignedWidgets.length} of {filteredWidgets.length} widgets assigned
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2">
                                    {filteredWidgets.map((widget) => (
                                        <div key={widget.id} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedWidgets.includes(widget.id)}
                                                    onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                                    disabled={isUpdating}
                                                />
                                                <div>
                                                    <div className="font-medium">{widget.name}</div>
                                                    <div className="text-sm text-muted-foreground">{widget.category}</div>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={getAssignmentStatus(widget, role.id)}
                                                onCheckedChange={(checked) => toggleAssignment(widget.id, role.id, checked)}
                                                disabled={isUpdating}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}
