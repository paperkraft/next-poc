"use client"

import { FlattenedMenuItem, MenuItem, PERMISSION_BITS, Role } from "@/components/tenant-admin/role-permission/role-permission-types"
import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react"
// import { type MenuItem, type FlattenedMenuItem, type Role, PERMISSION_BITS } from "../types"

type PermissionContextType = {
  // State
  selectedRole: Role | null
  menuItems: MenuItem[]
  flattened: FlattenedMenuItem[]
  groups: Map<string, MenuItem[]>
  permissions: Record<number, number>
  expanded: Record<number, boolean>
  groupExpanded: Record<string, boolean>
  searchTerm: string
  loading: boolean
  hasChanges: boolean

  // Actions
  setSelectedRole: (role: Role | null) => void
  setSearchTerm: (term: string) => void
  togglePermission: (id: number, bit: number) => void
  toggleAllForRow: (id: number, on: boolean) => void
  toggleExpanded: (id: number) => void
  toggleGroupExpanded: (groupName: string) => void
  assignPermissionSet: (moduleId: number, permissionSet: "none" | "read" | "write" | "full") => void
  bulkAssignToGroup: (groupName: string, permissionSet: "none" | "read" | "write" | "full") => void
  handleSubmit: () => Promise<void>
  clearSearch: () => void

  // Helpers
  isAllChecked: (id: number) => boolean
  canEnablePermission: (item: FlattenedMenuItem, bit: number) => boolean
  getActivePermissions: (id: number) => Array<{ key: string; label: string; color: string }>
  getPermissionLevel: (id: number) => "none" | "read" | "write" | "full"
  filterItemsBySearch: (items: FlattenedMenuItem[], term: string) => FlattenedMenuItem[]
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

type Props = {
  children: ReactNode
  tenantId: number
  roles: Role[]
}

export function PermissionProvider({ children, tenantId, roles }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState<Record<number, number>>({})
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [saveKey, setSaveKey] = useState(0)

  const initialPermissions = useRef<Record<number, number>>({})

  // Build flattened data and groups
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

  // Load menu items when role changes
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

  // Update permissions when menu items change
  useEffect(() => {
    if (menuItems.length > 0) {
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

  // Actions
  const togglePermission = (id: number, bit: number) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev }
      const currentValue = newPermissions[id] || 0
      const newValue = currentValue ^ bit

      const item = flattened.find((item) => item.id === id)
      if (!item) return prev

      if ((newValue & bit) === bit && item.parentId) {
        const parentCurrentValue = newPermissions[item.parentId] || 0
        if ((parentCurrentValue & bit) !== bit) {
          newPermissions[item.parentId] = parentCurrentValue | bit
        }
      }

      newPermissions[id] = newValue
      return newPermissions
    })
  }

  const toggleAllForRow = (id: number, on: boolean) => {
    const fullMask = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)

    setPermissions((prev) => {
      const newPermissions = { ...prev }
      const item = flattened.find((item) => item.id === id)
      if (!item) return prev

      if (on) {
        if (item.parentId) {
          newPermissions[item.parentId] = fullMask
        }
        newPermissions[id] = fullMask
      } else {
        newPermissions[id] = 0
      }

      return newPermissions
    })
  }

  const assignPermissionSet = (moduleId: number, permissionSet: "none" | "read" | "write" | "full") => {
    const item = flattened.find((item) => item.id === moduleId)
    if (!item) return

    let newPermissionBits = 0
    switch (permissionSet) {
      case "read":
        newPermissionBits = PERMISSION_BITS.READ
        break
      case "write":
        newPermissionBits = PERMISSION_BITS.READ | PERMISSION_BITS.WRITE
        break
      case "full":
        newPermissionBits = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)
        break
      case "none":
      default:
        newPermissionBits = 0
        break
    }

    setPermissions((prev) => {
      const newPermissions = { ...prev }

      // If enabling permissions on child, ensure parent has them
      if (newPermissionBits > 0 && item.parentId) {
        const parentCurrentValue = newPermissions[item.parentId] || 0
        newPermissions[item.parentId] = parentCurrentValue | newPermissionBits
      }

      newPermissions[moduleId] = newPermissionBits
      return newPermissions
    })
  }

  const bulkAssignToGroup = (groupName: string, permissionSet: "none" | "read" | "write" | "full") => {
    const groupItems = flattened.filter((item) => item.groupName === groupName)
    groupItems.forEach((item) => {
      assignPermissionSet(item.id, permissionSet)
    })
  }

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleGroupExpanded = (groupName: string) => {
    setGroupExpanded((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  const clearSearch = () => setSearchTerm("")

  const handleSubmit = async () => {
    if (!selectedRole) {
      alert("Please select a role first.")
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
      alert("No changes to save.")
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
      alert("Permissions saved successfully!")
    } else {
      alert("Failed to save permissions.")
    }
  }

  // Helpers
  const isAllChecked = (id: number) => {
    const fullMask = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)
    return (permissions[id] & fullMask) === fullMask
  }

  const canEnablePermission = (item: FlattenedMenuItem, bit: number): boolean => {
    if (!item.parentId) return true
    const parentPermissions = permissions[item.parentId] || 0
    return (parentPermissions & bit) === bit
  }

  const getActivePermissions = (id: number) => {
    const permissionConfig = [
      { key: "READ", label: "Read", color: "bg-blue-100 text-blue-700" },
      { key: "WRITE", label: "Write", color: "bg-green-100 text-green-700" },
      { key: "UPDATE", label: "Update", color: "bg-yellow-100 text-yellow-700" },
      { key: "DELETE", label: "Delete", color: "bg-red-100 text-red-700" },
    ]
    return permissionConfig.filter(
      (config) => permissions[id] & PERMISSION_BITS[config.key as keyof typeof PERMISSION_BITS],
    )
  }

  const getPermissionLevel = (id: number): "none" | "read" | "write" | "full" => {
    const perms = permissions[id] || 0
    const fullMask = Object.values(PERMISSION_BITS).reduce((a, b) => a | b, 0)

    if (perms === 0) return "none"
    if (perms === fullMask) return "full"
    if (perms & PERMISSION_BITS.WRITE) return "write"
    if (perms & PERMISSION_BITS.READ) return "read"
    return "none"
  }

  const filterItemsBySearch = (items: FlattenedMenuItem[], term: string) => {
    if (!term.trim()) return items
    const searchLower = term.toLowerCase()
    return items.filter(
      (item) => item.name.toLowerCase().includes(searchLower) || item.groupName.toLowerCase().includes(searchLower),
    )
  }

  const hasChanges = Object.entries(permissions).some(([id, value]) => {
    const original = initialPermissions.current?.[+id] ?? 0
    return value !== original
  })

  const value: PermissionContextType = {
    // State
    selectedRole,
    menuItems,
    flattened,
    groups,
    permissions,
    expanded,
    groupExpanded,
    searchTerm,
    loading,
    hasChanges,

    // Actions
    setSelectedRole,
    setSearchTerm,
    togglePermission,
    toggleAllForRow,
    toggleExpanded,
    toggleGroupExpanded,
    assignPermissionSet,
    bulkAssignToGroup,
    handleSubmit,
    clearSearch,

    // Helpers
    isAllChecked,
    canEnablePermission,
    getActivePermissions,
    getPermissionLevel,
    filterItemsBySearch,
  }

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider")
  }
  return context
}
