"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Crown } from "lucide-react"
import { usePermissions } from "@/context/permission-context"
import { Role } from "./role-permission-types"

type Props = {
  roles: Role[]
}

export function RoleSelectorWidget({ roles }: Props) {
  const { selectedRole, setSelectedRole } = usePermissions()

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-purple-600" />
          Role Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedRole?.id === role.id
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{role.name}</span>
                </div>
                {selectedRole?.id === role.id && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Active
                  </Badge>
                )}
              </div>
              {role.description && <p className="text-sm text-gray-600 mt-1 ml-6">{role.description}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
