"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Role } from "./role-permission-types"

type Props = {
    roles: Role[]
    selectedRole: Role | null
    onRoleChange: (role: Role | null) => void
}

export function RoleSelector({ roles, selectedRole, onRoleChange }: Props) {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <label htmlFor="role-select" className="font-medium text-gray-700">
                        Select Role:
                    </label>
                </div>
                <select
                    id="role-select"
                    value={selectedRole?.id || ""}
                    onChange={(e) => {
                        const roleId = Number.parseInt(e.target.value)
                        const role = roles.find((r) => r.id === roleId) || null
                        onRoleChange(role)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Choose a role...</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
                {selectedRole && (
                    <Badge variant="outline" className="ml-2">
                        {selectedRole.name}
                    </Badge>
                )}
            </div>
            {selectedRole?.description && <p className="text-sm text-gray-600 mt-2">{selectedRole.description}</p>}
        </Card>
    )
}