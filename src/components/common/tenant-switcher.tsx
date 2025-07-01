"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building2, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Mock tenant data
const tenants = [
    {
        id: 1,
        name: "Springfield University",
        type: "UNIVERSITY",
        slug: "springfield-uni",
        isActive: true,
    },
    {
        id: 2,
        name: "Riverside College",
        type: "COLLEGE",
        slug: "riverside-college",
        isActive: true,
    },
    {
        id: 3,
        name: "Oakwood High School",
        type: "SCHOOL",
        slug: "oakwood-high",
        isActive: true,
    },
]

interface TenantSwitcherProps {
    currentTenant: any
    onViewChange: (view: "system" | "tenant") => void
    activeView: "system" | "tenant"
}

export function TenantSwitcherN({ currentTenant, onViewChange, activeView }: TenantSwitcherProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedTenant, setSelectedTenant] = React.useState(currentTenant)

    const viewOptions = [
        {
            value: "system",
            label: "System Admin",
            icon: Settings,
            description: "Manage all tenants and system settings",
        },
        {
            value: "tenant",
            label: selectedTenant ? selectedTenant.name : "Select Tenant",
            icon: Building2,
            description: selectedTenant ? `Manage ${selectedTenant.name}` : "Select a tenant to manage",
        },
    ]

    const currentView = viewOptions.find((option) => option.value === activeView)

    return (
        <div className="space-y-2">
            {/* View Switcher */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-transparent"
                    >
                        <div className="flex items-center gap-2">
                            {currentView && <currentView.icon className="h-4 w-4" />}
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">{currentView?.label}</span>
                                <span className="text-xs text-muted-foreground">{currentView?.description}</span>
                            </div>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Views">
                                <CommandItem
                                    onSelect={() => {
                                        onViewChange("system")
                                        setOpen(false)
                                    }}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span>System Admin</span>
                                        <span className="text-xs text-muted-foreground">Manage all tenants and system settings</span>
                                    </div>
                                    <Check className={cn("ml-auto h-4 w-4", activeView === "system" ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            </CommandGroup>

                            <CommandGroup heading="Tenants">
                                <CommandInput placeholder="Search tenants..." />
                                <CommandEmpty>No tenant found.</CommandEmpty>
                                {tenants.map((tenant) => (
                                    <CommandItem
                                        key={tenant.id}
                                        onSelect={() => {
                                            setSelectedTenant(tenant)
                                            onViewChange("tenant")
                                            setOpen(false)
                                        }}
                                    >
                                        <Building2 className="mr-2 h-4 w-4" />
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center gap-2">
                                                <span>{tenant.name}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {tenant.type}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{tenant.slug}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                activeView === "tenant" && selectedTenant?.id === tenant.id ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
