"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, Users, Eye, Edit, Trash2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/context/permission-context"
import { PERMISSION_BITS } from "./role-permission-types"

const permissionConfig = [
  { key: "READ", label: "Read", icon: Eye, color: "bg-blue-100 text-blue-700" },
  { key: "WRITE", label: "Write", icon: Edit, color: "bg-green-100 text-green-700" },
  { key: "UPDATE", label: "Update", icon: Edit, color: "bg-yellow-100 text-yellow-700" },
  { key: "DELETE", label: "Delete", icon: Trash2, color: "bg-red-100 text-red-700" },
] as const

export function PermissionGridWidget() {
  const {
    selectedRole,
    flattened,
    groups,
    permissions,
    expanded,
    groupExpanded,
    searchTerm,
    loading,
    togglePermission,
    toggleAllForRow,
    toggleExpanded,
    toggleGroupExpanded,
    isAllChecked,
    canEnablePermission,
    getActivePermissions,
    filterItemsBySearch,
  } = usePermissions()

  if (!selectedRole) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Select a Role</h3>
          <p>Choose a role from the sidebar to manage its permissions.</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-medium mb-2">Loading Permissions</h3>
          <p className="text-gray-600">Fetching permission data for {selectedRole.name}...</p>
        </CardContent>
      </Card>
    )
  }

  const filteredGroups = searchTerm.trim()
    ? Array.from(new Set(filterItemsBySearch(flattened, searchTerm).map((item) => item.groupName)))
    : Array.from(groups.keys())

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

  if (filteredGroups.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Results Found</h3>
          <p>Try adjusting your search terms or clear the search to see all modules.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredGroups.map((groupName) => {
        const groupItems = flattened.filter((item) => item.groupName === groupName)
        const filteredItems = filterItemsBySearch(groupItems, searchTerm)

        if (filteredItems.length === 0) return null

        return (
          <Card key={groupName} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer transition-colors pb-3"
              onClick={() => toggleGroupExpanded(groupName)}
            >
              <CardTitle className="flex items-center gap-3 mb-4">
                {groupExpanded[groupName] ? (
                  <ChevronDown className="size-5 text-gray-500" />
                ) : (
                  <ChevronRight className="size-5 text-gray-500" />
                )}
                <Users className="size-4 text-primary" />
                <span>{groupName}</span>
                <Badge variant="secondary" className="ml-auto">
                  {searchTerm ? `${filteredItems.length} of ${groupItems.length}` : `${groupItems.length}`} modules
                </Badge>
              </CardTitle>
            </CardHeader>

            {groupExpanded[groupName] && (
              <CardContent className="p-0">
                <div className="border-t">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm text-gray-700 dark:text-gray-400">
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
                  {filteredItems.map((item) => {
                    const visible = item.level === 0 ? true : expanded[item.parentId!]
                    if (!visible) return null

                    const isParent = !!item.children?.length
                    const activePermissions = getActivePermissions(item.id)

                    const canEnableAllPermissions = () => {
                      if (!item.parentId) return true
                      const fullMask = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)
                      const parentPermissions = permissions[item.parentId] || 0
                      return (parentPermissions & fullMask) === fullMask
                    }

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors dark:hover:bg-slate-900",
                          item.level > 0 && "bg-gray-25",
                        )}
                      >
                        {/* Module Name */}
                        <div
                          className="col-span-4 flex items-center gap-2"
                          style={{ paddingLeft: `${item.level * 1.5}rem` }}
                        >
                          {isParent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(item.id)}
                              className="h-6 w-6 p-0"
                            >
                              {expanded[item.id] ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          )}
                          <span className="text-gray-900 dark:text-gray-400 text-sm">{highlightText(item.name, searchTerm)}</span>
                          {activePermissions.length > 0 && (
                            <div className="flex gap-1 flex-wrap lg:flex-nowrap">
                              {activePermissions.map((perm) => (
                                <Badge key={perm.key} variant="secondary" className={cn("text-xs size-5 flex justify-center items-center rounded-full", perm.color)}>
                                  {perm.label.charAt(0)}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* All Permissions Toggle */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="relative">
                            <Checkbox
                              checked={isAllChecked(item.id)}
                              disabled={!canEnableAllPermissions() && !isAllChecked(item.id)}
                              onCheckedChange={(checked) => toggleAllForRow(item.id, !!checked)}
                              className={cn(!canEnableAllPermissions() && !isAllChecked(item.id) && "opacity-50")}
                              title={
                                !canEnableAllPermissions() && !isAllChecked(item.id)
                                  ? "Parent must have all permissions first"
                                  : ""
                              }
                            />
                            {!canEnableAllPermissions() && !isAllChecked(item.id) && (
                              <AlertTriangle className="h-3 w-3 absolute -top-1 -right-1 text-amber-500" />
                            )}
                          </div>
                        </div>

                        {/* Individual Permissions */}
                        <div className="col-span-6 grid grid-cols-4 gap-2">
                          {permissionConfig.map((config) => {
                            const bit = PERMISSION_BITS[config.key]
                            const checked = !!(permissions[item.id] & bit)
                            const canEnable = canEnablePermission(item, bit)

                            return (
                              <div key={config.key} className="flex items-center justify-center">
                                <div className="relative">
                                  <Checkbox
                                    checked={checked}
                                    disabled={!canEnable && !checked}
                                    onCheckedChange={() => togglePermission(item.id, bit)}
                                    className={cn(!canEnable && !checked && "opacity-50")}
                                    title={!canEnable && !checked ? "Parent must have this permission first" : ""}
                                  />
                                  {!canEnable && !checked && (
                                    <AlertTriangle className="h-3 w-3 absolute -top-1 -right-1 text-amber-500" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
