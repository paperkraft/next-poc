"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Check } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

export function RoleSelector() {
    const { roles, selectedRole, selectedRoleData, setSelectedRole, getAssignedWidgetsCount, filteredWidgets } =
        useWidgetRoleAssignment()

    const assignedCount = getAssignedWidgetsCount()

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Select Role</h3>
                            <p className="text-sm text-muted-foreground">Choose a role to manage widget assignments</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select
                            value={selectedRole?.toString() || ""}
                            onValueChange={(value) => setSelectedRole(value ? Number.parseInt(value) : null)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select a role..." />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${role.color.split(" ")[0]}`} />
                                            {role.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedRoleData && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    {assignedCount}/{filteredWidgets.length} assigned
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
