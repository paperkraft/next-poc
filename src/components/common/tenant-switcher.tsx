"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building2, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tenant, useTenant } from "@/context/TenantProvider"

export function TenantSwitcher() {

    const [open, setOpen] = React.useState(false);

    const {
        currentTenant,
        tenants,
        activeView,
        loading,
        setActiveView,
        switchTenant
    } = useTenant();

    const viewOptions = [
        {
            value: "system",
            label: "System Admin",
            icon: Settings,
            description: "Manage all tenants and system settings",
        },
        {
            value: "tenant",
            label: currentTenant?.name || "Select Tenant",
            icon: Building2,
            description: currentTenant?.slug || "Select a tenant to manage",
        },
    ]

    const currentView = viewOptions.find((option) => option.value === activeView)

    const handleTenant = (tenant?: Tenant | null) => {
        if (tenant) {
            setActiveView('tenant');
            switchTenant(tenant.id);
        } else {
            setActiveView('system')
            switchTenant(0)
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
                        disabled={loading}
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
                                        setOpen(false);
                                        handleTenant()
                                    }}
                                >
                                    <Settings className="mr-2 size-4" />
                                    <div className="flex flex-col">
                                        <span>System Admin</span>
                                        <span className="text-xs text-muted-foreground">Manage all tenants and system settings</span>
                                    </div>
                                    <Check className={cn("ml-auto size-4", activeView === "system" ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            </CommandGroup>

                            <CommandGroup heading="Tenants">
                                <CommandInput placeholder="Search tenants..." />
                                <CommandEmpty>No tenant found.</CommandEmpty>
                                {tenants?.map((tenant) => (
                                    <CommandItem
                                        key={tenant.id}
                                        onSelect={() => {
                                            setOpen(false);
                                            handleTenant(tenant);
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
                                                activeView === "tenant" &&
                                                    currentTenant?.id === tenant.id
                                                    ? "opacity-100"
                                                    : "opacity-0",
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
