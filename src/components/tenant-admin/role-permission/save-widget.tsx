"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Shield, AlertTriangle } from "lucide-react"
import { usePermissions } from "@/context/permission-context"

export function SaveWidget() {
  const { selectedRole, hasChanges, handleSubmit } = usePermissions()

  if (!selectedRole) return null

  return (
    <Card className={hasChanges ? "border-orange-200 bg-orange-50 dark:border-orange-50/10 dark:bg-orange-50/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasChanges ? (
              <>
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-amber-600" />
                <span className="font-medium text-orange-700 dark:text-amber-600">You have unsaved changes</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">All changes saved</span>
              </>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || !selectedRole}
            className="flex items-center gap-2"
            variant={hasChanges ? "default" : "outline"}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
