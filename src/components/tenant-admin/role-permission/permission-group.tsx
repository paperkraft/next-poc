"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Users } from "lucide-react"
import { PermissionRow } from "./permission-row"
import { FlattenedMenuItem } from "./role-permission-types"
import { permissionConfig } from "@/constants/permissions"

type Props = {
    groupName: string
    items: FlattenedMenuItem[]
    totalItems: number
    isExpanded: boolean
    permissions: Record<number, number>
    expanded: Record<number, boolean>
    searchTerm: string
    onToggleGroup: () => void
    onToggleExpanded: (id: number) => void
    onTogglePermission: (id: number, bit: number) => void
    onToggleAllForRow: (id: number, on: boolean) => void
    isAllChecked: (id: number) => boolean
    isInherited: (item: FlattenedMenuItem, bit: number) => boolean
    canEnablePermission: (item: FlattenedMenuItem, bit: number) => boolean
}

export function PermissionGroup({
    groupName,
    items,
    totalItems,
    isExpanded,
    permissions,
    expanded,
    searchTerm,
    onToggleGroup,
    onToggleExpanded,
    onTogglePermission,
    onToggleAllForRow,
    isAllChecked,
    isInherited,
    canEnablePermission,
}: Props) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggleGroup}>
                <CardTitle className="flex items-center gap-3">
                    {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>{groupName}</span>
                    <Badge variant="secondary" className="ml-auto">
                        {searchTerm ? `${items.length} of ${totalItems}` : `${totalItems}`} modules
                    </Badge>
                </CardTitle>
            </CardHeader>

            {isExpanded && (
                <CardContent className="p-0">
                    <div className="border-t">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-sm text-gray-700">
                            <div className="col-span-4">Module</div>
                            <div className="col-span-2 text-center">All Permissions</div>
                            <div className="col-span-6 grid grid-cols-4 gap-2">
                                {permissionConfig.map((config) => (
                                    <div key={config.key} className="text-center flex items-center justify-center gap-1">
                                        <config.icon className="size-4" />
                                        <span className="hidden sm:inline">{config.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rows */}
                        {items.map((item) => {
                            const visible = item.level === 0 ? true : expanded[item.parentId!]
                            if (!visible) return null

                            return (
                                <PermissionRow
                                    key={item.id}
                                    item={item}
                                    permissions={permissions}
                                    expanded={expanded}
                                    searchTerm={searchTerm}
                                    onToggleExpanded={onToggleExpanded}
                                    onTogglePermission={onTogglePermission}
                                    onToggleAllForRow={onToggleAllForRow}
                                    isAllChecked={isAllChecked}
                                    isInherited={isInherited}
                                    canEnablePermission={canEnablePermission}
                                />
                            )
                        })}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
