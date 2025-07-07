"use client"

import { useSystemWidgetAssignment } from "@/context/system-widget-assignment-context"
import { SelectAllHeader } from "../select-all-header"
import { WidgetCard } from "../widget-card"

export function CardsView() {
    const { filteredWidgets } = useSystemWidgetAssignment()

    return (
        <div className="space-y-4">
            <SelectAllHeader widgets={filteredWidgets} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWidgets.map((widget) => (
                    <WidgetCard key={widget.id} widget={widget} />
                ))}
            </div>
        </div>
    )
}
