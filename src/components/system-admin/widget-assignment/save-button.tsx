"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useSystemWidgetAssignment } from "@/context/system-widget-assignment-context"

export function WidgetAssignmentSaveButton() {
    const { isLoading, handleSave, filteredWidgets, allWidgets } = useSystemWidgetAssignment()

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {filteredWidgets.length} of {allWidgets.length} widgets
            </div>
            <Button onClick={handleSave} disabled={isLoading} size="lg">
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Assignments
                    </>
                )}
            </Button>
        </div>
    )
}
