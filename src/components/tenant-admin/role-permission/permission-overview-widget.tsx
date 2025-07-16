"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, AlertTriangle } from "lucide-react"
import { usePermissions } from "@/context/permission-context"

export function PermissionOverviewWidget() {
  const { selectedRole, flattened, permissions, groups } = usePermissions()

  if (!selectedRole) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-center text-gray-500">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a role to view overview</p>
        </CardContent>
      </Card>
    )
  }

  const totalModules = flattened.length
  const modulesWithPermissions = flattened.filter((item) => permissions[item.id] > 0).length
  const coveragePercentage = totalModules > 0 ? Math.round((modulesWithPermissions / totalModules) * 100) : 0

  const groupStats = Array.from(groups.entries()).map(([groupName, items]) => {
    const groupFlattened = flattened.filter((item) => item.groupName === groupName)
    const withPermissions = groupFlattened.filter((item) => permissions[item.id] > 0).length
    const total = groupFlattened.length
    const percentage = total > 0 ? Math.round((withPermissions / total) * 100) : 0

    return {
      name: groupName,
      withPermissions,
      total,
      percentage,
    }
  })

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-green-600" />
          Permission Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Coverage</span>
            <Badge variant={coveragePercentage > 50 ? "default" : "secondary"}>{coveragePercentage}%</Badge>
          </div>
          <Progress value={coveragePercentage} className="h-2" />
          <p className="text-xs text-gray-600">
            {modulesWithPermissions} of {totalModules} modules have permissions
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Group Breakdown
          </h4>
          <div className="space-y-3">
            {groupStats.map((group) => (
              <div key={group.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{group.name}</span>
                  <span className="text-xs text-gray-600">
                    {group.withPermissions}/{group.total}
                  </span>
                </div>
                <Progress value={group.percentage} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {coveragePercentage < 30 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Low Permission Coverage</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Consider assigning more permissions to this role for better functionality.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
