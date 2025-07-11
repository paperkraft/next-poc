"use client"

import { Button } from "@/components/ui/button"
import { Grid3X3, List, Package } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function WidgetRoleAssignmentHeader() {
    const { viewMode, setViewMode, selectedRole } = useWidgetRoleAssignment()

    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold">Widget Assignment</h2>
                <p className="text-muted-foreground">
                    {selectedRole ? "Manage widget assignments for the selected role" : "Select a role to begin"}
                </p>
            </div>
            {selectedRole && (
                <div className="flex items-center gap-2">
                    <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
                        <List className="w-4 h-4" />
                    </Button>
                    <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>
                        <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === "category" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("category")}
                    >
                        <Package className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
