'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export function TenantSwitcher({
    currentTenant,
    tenants
}: {
    currentTenant?: { id: number; slug: string; name: string } | null
    tenants: Array<{ id: number; slug: string; name: string }> | null
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const systemTenant = {
        id: 0,
        name: 'System',
        slug: 'admin',
    }

    // Combine the system tenant with the retrieved tenants
    const tenantsWithSystem = [systemTenant, ...(tenants ?? [])];

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
            const slug = result?.tenant?.slug;
            slug ? router.replace(`/${slug}/dashboard`) : router.refresh()

            // router.refresh()
        } catch (error) {
            console.error('Tenant switch failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={loading}>
                    {loading ? 'Switching...' : currentTenant?.name ?? 'System'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {tenantsWithSystem?.map((tenant) => (
                    <DropdownMenuItem
                        key={tenant.id}
                        onClick={() => switchTenant(tenant.id)}
                        disabled={tenant.id === (currentTenant?.id ?? 0)}
                    >
                        {tenant.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}