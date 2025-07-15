"use client"

import * as React from "react"
import { Building2, Check, ChevronsUpDown, Settings } from "lucide-react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import AppLogo from "../custom/app-initial"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { themeConfig } from "@/hooks/use-config"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

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

export function HeaderTeamSwitcher({ currentTenant, tenants = [] }: TenantSwitcherProps) {
    const router = useRouter();
    const [config] = themeConfig();
    const { isMobile } = useSidebar();
    const { data: session } = useSession();
    const sessionTenantId = session?.user?.tenantId;

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(currentTenant ?? null);
    const [activeView, setActiveView] = React.useState<"system" | "tenant">(
        currentTenant ? "tenant" : "system"
    );

    const isDual = (config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile

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
            label: "System",
            slug: "Manage all tenants"
        },
        {
            value: "tenant",
            label: selectedTenant?.name || "Select Tenant",
            slug: selectedTenant?.slug || ""
        },
    ]

    const currentView = viewOptions.find((option) => option.value === activeView);

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
        }
    }

    const handleTenant = (tenant?: Tenant | null) => {
        if (tenant) {
            setActiveView('tenant');
            setSelectedTenant(tenant);
            switchTenant(tenant.id);
        } else {
            setActiveView('system')
            setSelectedTenant(null);
            switchTenant(0)
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-0",
                                isDual && "size-8"
                            )}
                            onClick={() => setOpen(!open)}
                            disabled={loading}
                        >
                            <AppLogo />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{currentView?.label}</span>
                                <span className="truncate text-xs">{currentView?.slug}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </PopoverTrigger>

                    <PopoverContent
                        //w-[--radix-popover-trigger-width]
                        align="start"
                        className="p-0 min-w-60 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem onSelect={() => {
                                        setOpen(false);
                                        handleTenant()
                                    }}>
                                        <Settings className="mr-2 size-4" />
                                        <div className="flex flex-col flex-1">
                                            <span>System</span>
                                            <span className="text-xs text-muted-foreground">Manage all tenants and system settings</span>
                                        </div>
                                        <Check className={cn("ml-auto size-4", activeView === "system" ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandInput placeholder="Search tenants..." />
                                <CommandEmpty>No tenant found.</CommandEmpty>

                                <CommandGroup heading="Tenants">
                                    {tenants?.map((tenant) => (
                                        <CommandItem
                                            key={tenant.id}
                                            onSelect={() => {
                                                setOpen(false);
                                                handleTenant(tenant);
                                            }}
                                        >

                                            <Building2 className="mr-2 size-4" />
                                            <div className="flex flex-col flex-1">
                                                <div className="flex items-center gap-2 justify-between">
                                                    <span>{tenant.name}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {tenant.type}
                                                    </Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{tenant.slug}</span>
                                            </div>
                                            <Check className={cn("ml-1 size-4", activeView === "tenant" && selectedTenant?.id === tenant.id ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                    ))}

                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </SidebarMenuItem>
        </SidebarMenu >
    )
}