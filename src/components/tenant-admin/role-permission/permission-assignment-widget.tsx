"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Eye, Edit } from "lucide-react"
import { usePermissions } from "@/context/permission-context"

const permissionSets = [
  {
    key: "none" as const,
    label: "No Access",
    description: "No permissions",
    color: "bg-gray-100 text-gray-700",
    icon: Shield,
  },
  {
    key: "read" as const,
    label: "View Only",
    description: "Read permissions only",
    color: "bg-blue-100 text-blue-700",
    icon: Eye,
  },
  {
    key: "write" as const,
    label: "Editor",
    description: "Read and write permissions",
    color: "bg-green-100 text-green-700",
    icon: Edit,
  },
  {
    key: "full" as const,
    label: "Full Access",
    description: "All permissions",
    color: "bg-purple-100 text-purple-700",
    icon: Zap,
  },
]

export function PermissionAssignmentWidget() {
  const { selectedRole, flattened, assignPermissionSet, getPermissionLevel } = usePermissions()

  if (!selectedRole) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-center text-gray-500">
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a role to assign permissions</p>
        </CardContent>
      </Card>
    )
  }

  const parentModules = flattened.filter((item) => item.level === 0)

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-orange-600" />
          Quick Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {permissionSets.map((set) => (
            <Button
              key={set.key}
              variant="outline"
              size="sm"
              className={`h-auto p-3 flex flex-col items-center gap-1 ${set.color}`}
              onClick={() => {
                parentModules.forEach((module) => {
                  assignPermissionSet(module.id, set.key)
                })
              }}
            >
              <set.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{set.label}</span>
            </Button>
          ))}
        </div>

        <div className="border-t pt-4 hidden">
          <h4 className="text-sm font-medium mb-3">Individual Modules</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {parentModules.map((module) => {
              const currentLevel = getPermissionLevel(module.id)
              const currentSet = permissionSets.find((set) => set.key === currentLevel)

              return (
                <div key={module.id} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{module.name}</span>
                    <Badge variant="secondary" className={currentSet?.color}>
                      {currentSet?.label}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {permissionSets.map((set) => (
                      <Button
                        key={set.key}
                        variant={currentLevel === set.key ? "default" : "ghost"}
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => assignPermissionSet(module.id, set.key)}
                        title={set.description}
                      >
                        <set.icon className="h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
