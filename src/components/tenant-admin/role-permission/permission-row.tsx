"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, Eye, Edit, Trash2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { FlattenedMenuItem, PERMISSION_BITS } from "./role-permission-types"

const permissionConfig = [
    { key: "READ", label: "Read", icon: Eye, color: "bg-blue-100 text-blue-700" },
    { key: "WRITE", label: "Write", icon: Edit, color: "bg-green-100 text-green-700" },
    { key: "UPDATE", label: "Update", icon: Edit, color: "bg-yellow-100 text-yellow-700" },
    { key: "DELETE", label: "Delete", icon: Trash2, color: "bg-red-100 text-red-700" },
] as const

type Props = {
    item: FlattenedMenuItem
    permissions: Record<number, number>
    expanded: Record<number, boolean>
    searchTerm: string
    onToggleExpanded: (id: number) => void
    onTogglePermission: (id: number, bit: number) => void
    onToggleAllForRow: (id: number, on: boolean) => void
    isAllChecked: (id: number) => boolean
    isInherited: (item: FlattenedMenuItem, bit: number) => boolean
}

export function PermissionRow({
    item,
    permissions,
    expanded,
    searchTerm,
    onToggleExpanded,
    onTogglePermission,
    onToggleAllForRow,
    isAllChecked,
    isInherited,
}: Props) {
    const isParent = !!item.children?.length

    const getActivePermissions = (id: number) => {
        return permissionConfig.filter((config) => permissions[id] & PERMISSION_BITS[config.key])
    }

    const highlightText = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text

        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            ),
        )
    }

    const activePermissions = getActivePermissions(item.id)

    return (
        <div
            className={cn(
                "grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors",
                item.level > 0 && "bg-gray-25",
            )}
        >
            {/* Module Name */}
            <div className="col-span-4 flex items-center gap-2" style={{ paddingLeft: `${item.level * 1.5}rem` }}>
                {isParent && (
                    <Button variant="ghost" size="sm" onClick={() => onToggleExpanded(item.id)} className="h-6 w-6 p-0">
                        {expanded[item.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </Button>
                )}
                <span className="font-medium text-gray-900">{highlightText(item.name, searchTerm)}</span>
                {activePermissions.length > 0 && (
                    <div className="hidden lg:flex gap-1 md:flex-wrap lg:flex-nowrap">
                        {activePermissions.map((perm) => (
                            <Badge key={perm.key} variant="secondary" className={cn("text-xs", perm.color)}>
                                {perm.label}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* All Permissions Toggle */}
            <div className="col-span-2 flex items-center justify-center">
                <Checkbox
                    checked={isAllChecked(item.id)}
                    onCheckedChange={(checked) => onToggleAllForRow(item.id, !!checked)}
                />
            </div>

            {/* Individual Permissions */}
            <div className="col-span-6 grid grid-cols-4 gap-2">
                {permissionConfig.map((config) => {
                    const bit = PERMISSION_BITS[config.key]
                    const inherited = isInherited(item, bit)
                    const checked = !!(permissions[item.id] & bit)

                    return (
                        <div key={config.key} className="flex items-center justify-center">
                            <div className="relative">
                                <Checkbox
                                    checked={checked || inherited}
                                    disabled={inherited}
                                    onCheckedChange={() => onTogglePermission(item.id, bit)}
                                    className={cn(inherited && "opacity-50")}
                                />
                                {inherited && <Lock className="h-3 w-3 absolute -top-1 -right-1 text-gray-400" />}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}