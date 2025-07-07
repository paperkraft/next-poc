"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, Check, Star } from "lucide-react"
import { useSystemWidgetAssignment } from "@/context/system-widget-assignment-context"

export function WidgetAssignmentStats() {
    const { allWidgets, assignedCount, defaultCount } = useSystemWidgetAssignment()

    return (
        <div className="flex gap-4">
            <Card className="flex-1">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Widgets</p>
                            <p className="text-2xl font-bold">{allWidgets.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                            <p className="text-2xl font-bold">{assignedCount}</p>
                        </div>
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Default</p>
                            <p className="text-2xl font-bold">{defaultCount}</p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
