"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building2, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tenant } from "@prisma/client"
import { useRouter } from "next/navigation"

interface TenantSwitcherProps {
    currentTenant?: Tenant | null
    onViewChange: (view: "system" | "tenant") => void
    activeView: "system" | "tenant"
    tenants?: Tenant[] | null
}

export function TenantSwitcherN({ currentTenant, onViewChange, activeView, tenants = [] }: TenantSwitcherProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [selectedTenant, setSelectedTenant] = React.useState(currentTenant);

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

    const switchTenant = async (tenantId: number) => {

        console.log('tenantId', tenantId)

        setLoading(true)
        try {
            const response = await fetch('/api/switch-tenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tenantId }),
            })

            if (!response.ok) {
                throw new Error('Failed to switch tenant')
            }

            // Force refresh to update session-dependent components
            const result = await response.json();
            const slug = result?.tenant?.slug;
            // slug ? router.replace(`/${result?.tenant?.slug}/dashboard`) : router.refresh()
            router.replace(`/${slug ?? 'admin'}/dashboard`)

            // router.refresh()
        } catch (error) {
            console.error('Tenant switch failed:', error)
        } finally {
            setLoading(false)
        }
    }

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
                                {tenants?.map((tenant) => (
                                    <CommandItem
                                        key={tenant.id}
                                        onSelect={() => {
                                            setSelectedTenant(tenant)
                                            onViewChange("tenant")
                                            setOpen(false)
                                            switchTenant(tenant.id)
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
