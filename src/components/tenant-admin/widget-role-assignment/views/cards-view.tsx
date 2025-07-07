"use client"

import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"
import { SelectAllHeader } from "../select-all-header"
import { WidgetRoleCard } from "../widget-role-card"

export function CardsView() {
    const { filteredWidgets } = useWidgetRoleAssignment()

    return (
        <div className="space-y-4">
            <SelectAllHeader widgets={filteredWidgets} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredWidgets.map((widget) => (
                    <WidgetRoleCard key={widget.id} widget={widget} />
                ))}
            </div>
        </div>
    )
}
