"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Save } from "lucide-react"
import { RoleSelector } from "./role-permission/role-selector"
import { SearchBar } from "./role-permission/search-bar"
import { SearchResultsInfo } from "./role-permission/search-results-info"
import { PermissionGroup } from "./role-permission/permission-group"
import { NoRoleSelected, LoadingState, NoSearchResults } from "./role-permission/empty-states"
import { UnsavedChangesBanner } from "./role-permission/unsaved-changes-banner"
import { type MenuItem, type FlattenedMenuItem, type Role, PERMISSION_BITS } from "./role-permission/role-permission-types"
import { toast } from "sonner"

type Props = {
    tenantId: number
    roles: Role[]
}

export default function RolePermissionTable({ tenantId, roles }: Props) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(false)
    const [saveKey, setSaveKey] = useState(0)

    useEffect(() => {
        if (selectedRole) {
            setLoading(true)
            fetch(`/api/roles/${selectedRole.id}/permissions`)
                .then((res) => res.json())
                .then((data) => {
                    setMenuItems(data)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error("Failed to fetch menu items:", error)
                    setLoading(false)
                })
        } else {
            setMenuItems([])
        }
    }, [selectedRole])

    useEffect(() => {
        if (menuItems.length > 0) {
            // Rebuild flattened array for the new menuItems
            const newFlattened: FlattenedMenuItem[] = []
            const newGroups = new Map<string, MenuItem[]>()

            for (const item of menuItems) {
                const group = item.group?.name || "Ungrouped"
                if (!newGroups.has(group)) newGroups.set(group, [])
                newGroups.get(group)!.push(item)
            }

            const buildNewFlattened = (items: MenuItem[], level = 0, groupName = "Ungrouped") => {
                for (const item of items) {
                    newFlattened.push({ ...item, level, groupName })
                    if (item.children) buildNewFlattened(item.children, level + 1, groupName)
                }
            }

            for (const [groupName, items] of newGroups.entries()) {
                buildNewFlattened(items, 0, groupName)
            }

            // Update permissions state based on new menu items
            const newPermissions = newFlattened.reduce(
                (acc, item) => {
                    acc[item.id] = item.permissionBits || 0
                    return acc
                },
                {} as Record<number, number>,
            )

            setPermissions(newPermissions)
            initialPermissions.current = { ...newPermissions }
            setSaveKey(0)
            setGroupExpanded(Object.fromEntries(Array.from(newGroups.keys()).map((g) => [g, true])))
            setExpanded({})
        } else {
            setPermissions({})
            initialPermissions.current = {}
            setSaveKey(0)
            setGroupExpanded({})
            setExpanded({})
        }
    }, [menuItems])

    // Build flattened data
    const flattened: FlattenedMenuItem[] = []
    const groups = new Map<string, MenuItem[]>()

    if (menuItems.length > 0) {
        for (const item of menuItems) {
            const group = item.group?.name || "Ungrouped"
            if (!groups.has(group)) groups.set(group, [])
            groups.get(group)!.push(item)
        }

        const buildFlattened = (items: MenuItem[], level = 0, groupName = "Ungrouped") => {
            for (const item of items) {
                flattened.push({ ...item, level, groupName })
                if (item.children) buildFlattened(item.children, level + 1, groupName)
            }
        }

        for (const [groupName, items] of groups.entries()) {
            buildFlattened(items, 0, groupName)
        }
    }

    // State management
    const [expanded, setExpanded] = useState<Record<number, boolean>>({})
    const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>(
        Object.fromEntries(Array.from(groups.keys()).map((g) => [g, true])),
    )
    const [permissions, setPermissions] = useState<Record<number, number>>({})
    const [searchTerm, setSearchTerm] = useState("")

    const initialPermissions = useRef<Record<number, number>>()

    if (!initialPermissions.current) {
        initialPermissions.current = { ...permissions }
    }

    // Helper functions
    const togglePermission = (id: number, bit: number) => {
        setPermissions((prev) => ({
            ...prev,
            [id]: prev[id] ^ bit,
        }))
    }

    const toggleAllForRow = (id: number, on: boolean) => {
        const fullMask = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)
        setPermissions((prev) => ({
            ...prev,
            [id]: on ? fullMask : 0,
        }))
    }

    const isAllChecked = (id: number) => {
        const fullMask = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)
        return (permissions[id] & fullMask) === fullMask
    }

    const isInherited = (item: FlattenedMenuItem, bit: number): boolean =>
        !!item.parentId && (permissions[item.parentId] & bit) === bit && (permissions[item.id] & bit) !== bit

    const hasChanges = () => {
        return Object.entries(permissions).some(([id, value]) => {
            const original = initialPermissions.current?.[+id] ?? 0
            return value !== original
        })
    }

    const filterItemsBySearch = (items: FlattenedMenuItem[], term: string) => {
        if (!term.trim()) return items

        const searchLower = term.toLowerCase()
        return items.filter(
            (item) => item.name.toLowerCase().includes(searchLower) || item.groupName.toLowerCase().includes(searchLower),
        )
    }

    const getFilteredGroups = () => {
        if (!searchTerm.trim()) return Array.from(groups.keys())

        const filteredItems = filterItemsBySearch(flattened, searchTerm)
        const visibleGroups = new Set(filteredItems.map((item) => item.groupName))
        return Array.from(visibleGroups)
    }

    const getFilteredItemsForGroup = (groupName: string) => {
        const groupItems = flattened.filter((item) => item.groupName === groupName)
        return filterItemsBySearch(groupItems, searchTerm)
    }

    const handleSubmit = async () => {
        if (!selectedRole) {
            toast.error("Please select a role first.")
            return
        }

        const changes = Object.entries(permissions)
            .filter(([id, value]) => {
                const original = initialPermissions.current?.[+id] ?? 0
                return value !== original
            })
            .map(([id, permissionBits]) => ({
                menuId: +id,
                permissionBits,
            }))

        if (!changes.length) {
            toast.info("No changes to save.")
            return
        }

        const res = await fetch("/api/role-permissions", {
            method: "POST",
            body: JSON.stringify({ roleId: selectedRole.id, tenantId, permissions: changes }),
            headers: { "Content-Type": "application/json" },
        })

        if (res.ok) {
            initialPermissions.current = { ...permissions }
            setSaveKey((prev) => prev + 1)
            toast.success("Permissions saved successfully!")
        } else {
            toast.error("Failed to save permissions.")
        }
    }

    const filteredGroups = getFilteredGroups()
    const totalFilteredItems = flattened.filter((item) => filterItemsBySearch([item], searchTerm).length > 0).length

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
                            <p className="text-gray-600">Manage access permissions for this role</p>
                        </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={!hasChanges() || !selectedRole} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                <RoleSelector roles={roles} selectedRole={selectedRole} onRoleChange={setSelectedRole} />

                <SearchResultsInfo
                    searchTerm={searchTerm}
                    filteredCount={totalFilteredItems}
                    totalGroups={filteredGroups.length}
                    onClearSearch={() => setSearchTerm("")}
                />
            </div>

            {!selectedRole ? (
                <NoRoleSelected />
            ) : loading ? (
                <LoadingState roleName={selectedRole.name} />
            ) : filteredGroups.length === 0 ? (
                <NoSearchResults onClearSearch={() => setSearchTerm("")} />
            ) : (
                filteredGroups.map((groupName) => {
                    const filteredItems = getFilteredItemsForGroup(groupName)
                    if (filteredItems.length === 0) return null

                    return (
                        <PermissionGroup
                            key={groupName}
                            groupName={groupName}
                            items={filteredItems}
                            totalItems={flattened.filter((item) => item.groupName === groupName).length}
                            isExpanded={groupExpanded[groupName]}
                            permissions={permissions}
                            expanded={expanded}
                            searchTerm={searchTerm}
                            onToggleGroup={() =>
                                setGroupExpanded((prev) => ({
                                    ...prev,
                                    [groupName]: !prev[groupName],
                                }))
                            }
                            onToggleExpanded={(id) =>
                                setExpanded((prev) => ({
                                    ...prev,
                                    [id]: !prev[id],
                                }))
                            }
                            onTogglePermission={togglePermission}
                            onToggleAllForRow={toggleAllForRow}
                            isAllChecked={isAllChecked}
                            isInherited={isInherited}
                        />
                    )
                })
            )}

            {hasChanges() && <UnsavedChangesBanner onSave={handleSubmit} />}
        </div>
    )
}
