"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building2, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Tenant {
    id: number;
    slug: string;
    name: string;
    type: string;
}

interface TenantSwitcherProps {
    currentTenant?: Tenant | null
    tenants?: Tenant[] | null
}

export function TenantSwitcher({ currentTenant, tenants = [] }: TenantSwitcherProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const sessionTenantId = session?.user?.tenantId;

    // STATE
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(currentTenant ?? null);
    const [activeView, setActiveView] = React.useState<"system" | "tenant">(
        currentTenant ? "tenant" : "system"
    );

    // On session or tenant prop change, adjust the view
    React.useEffect(() => {
        if (!sessionTenantId || !currentTenant) {
            setActiveView("system");
            setSelectedTenant(null);
        } else {
            setActiveView("tenant");
            setSelectedTenant(currentTenant);
        }
    }, [sessionTenantId, currentTenant]);


    const viewOptions = [
        {
            value: "system",
            label: "System Admin",
            icon: Settings,
            description: "Manage all tenants and system settings",
        },
        {
            value: "tenant",
            label: selectedTenant?.name || "Select Tenant",
            icon: Building2,
            description: selectedTenant?.slug || "Select a tenant to manage",
        },
    ]

    const currentView = viewOptions.find((option) => option.value === activeView)

    const switchTenant = async (tenantId: number) => {
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
            const slug = result?.tenant?.slug ?? "admin"; // fallback to system slug
            router.replace(`/${slug}/dashboard`);
        } catch (error) {
            console.error('Tenant switch failed:', error)
        } finally {
            setLoading(false)
            // router.refresh();
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
                                        setActiveView("system");
                                        setSelectedTenant(null);
                                        setOpen(false)
                                        switchTenant(0)
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
                                            setSelectedTenant(tenant)
                                            setActiveView("tenant")
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
                                                activeView === "tenant" &&
                                                    selectedTenant?.id === tenant.id
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
