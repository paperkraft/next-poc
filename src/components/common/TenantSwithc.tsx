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
    currentTenant?: { id: number; slug: string; name: string }
    tenants: Array<{ id: number; slug: string; name: string }>
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
            slug ? router.replace(`/${result?.tenant?.slug}/dashboard`) : router.refresh()

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
                    {currentTenant?.name ?? "select"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {tenants.map((tenant) => (
                    <DropdownMenuItem
                        key={tenant.id}
                        onClick={() => switchTenant(tenant.id)}
                        disabled={tenant.id === currentTenant?.id}
                    >
                        {tenant.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}