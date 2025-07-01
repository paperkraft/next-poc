"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { extractTenantSlugFromPath } from "@/lib/tenants"

interface TenantContextType {
    tenant: any | null
    isLoading: boolean
    switchTenant: (tenantSlug: string) => void
    refreshTenant: () => void
    tenantSlug: string | null
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({
    children,
    initialTenant,
}: {
    children: React.ReactNode
    initialTenant?: any
}) {
    const [tenant, setTenant] = useState(initialTenant || null)
    const [isLoading, setIsLoading] = useState(!initialTenant)
    const pathname = usePathname()
    const router = useRouter()
    const tenantSlug = extractTenantSlugFromPath(pathname)

    const switchTenant = (newTenantSlug: string) => {
        // Navigate to new tenant path
        router.push(`/${newTenantSlug}`)
    }

    const refreshTenant = async () => {
        if (!tenantSlug) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/tenants/${tenantSlug}`)
            if (response.ok) {
                const tenantData = await response.json()
                setTenant(tenantData)
            }
        } catch (error) {
            console.error("Error refreshing tenant:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!initialTenant && tenantSlug) {
            refreshTenant()
        }
    }, [initialTenant, tenantSlug])

    return (
        <TenantContext.Provider value={{ tenant, isLoading, switchTenant, refreshTenant, tenantSlug }}>
            {children}
        </TenantContext.Provider>
    )
}

export function useTenant() {
    const context = useContext(TenantContext)
    if (context === undefined) {
        throw new Error("useTenant must be used within a TenantProvider")
    }
    return context
}