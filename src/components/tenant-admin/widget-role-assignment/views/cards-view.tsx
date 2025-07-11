"use client"

import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { SelectAllHeader } from "../select-all-header"
import { WidgetCard } from "../widget-card"

export function CardsView() {
    const { filteredWidgets, selectedRole } = useWidgetRoleAssignment()

    if (!selectedRole) return null

    return (
        <div className="space-y-4">
            <SelectAllHeader widgets={filteredWidgets} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredWidgets.map((widget) => (
                    <WidgetCard key={widget.id} widget={widget} />
                ))}
            </div>
        </div>
    )
}
