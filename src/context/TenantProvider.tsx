'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext } from 'react';

import { GroupedMenus } from '@/lib/menus';

export type Tenant = {
    id: number
    name: string
    slug: string
    type: string
}

export type TenantContextType = {
    currentTenant?: Tenant | null;
    tenants?: Tenant[] | null;
    menus: GroupedMenus[];
    loading: boolean;
    session: Session | null;
    activeView: "system" | "tenant";
    isSystem: boolean;

    switchTenant: (tenantId: number) => void
    setActiveView: React.Dispatch<React.SetStateAction<"system" | "tenant">>
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

type TenantProviderProps = {
    currentTenant?: Tenant | null;
    tenants?: Tenant[] | null;
    menus: GroupedMenus[];
    children: React.ReactNode;
    isSystem: boolean;
}

export function TenantProvider({ currentTenant, children, tenants, menus = [], isSystem = false }: TenantProviderProps) {

    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = React.useState(false);
    const [activeView, setActiveView] = React.useState<"system" | "tenant">("system");

    React.useEffect(() => {
        if (!currentTenant) {
            setActiveView("system")
        } else {
            setActiveView("tenant")
        }
    }, [currentTenant]);

    const switchTenant = async (tenantId: number) => {
        setLoading(true);

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

    const values = {
        menus,
        tenants,
        loading,
        session,
        activeView,
        isSystem,
        currentTenant,

        switchTenant,
        setActiveView
    }

    return (
        <TenantContext.Provider value={values}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}