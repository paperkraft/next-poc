'use client';

import { GroupedMenus } from '@/lib/menus';
import { Tenant } from '@prisma/client';
import { createContext, useContext } from 'react';

export type TenantContextType = {
    tenant?: Tenant | null;
    menus: GroupedMenus[]
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

type TenantProviderProps = {
    children: React.ReactNode;
    tenant?: Tenant | null;
    menus: GroupedMenus[]
}

export function TenantProvider({ children, tenant, menus }: TenantProviderProps) {

    return (
        <TenantContext.Provider value={{ tenant, menus }}>
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