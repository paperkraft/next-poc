"use client"

import { TenantFormData } from "@/types/tenant"
import { createContext, useContext, useState, type ReactNode } from "react"

interface TenantContextType {
    formData: TenantFormData
    updateFormData: (updates: Partial<TenantFormData>) => void
    updateNestedField: (field: keyof TenantFormData, nestedField: string, value: any) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const useTenantContext = () => {
    const context = useContext(TenantContext)
    if (!context) {
        throw new Error("useTenantContext must be used within a TenantProvider")
    }
    return context
}

const initialFormData: TenantFormData = {
    name: "",
    description: "",
    slug: "",
    type: "BUSINESS",
    parentId: null,
    address: {},
    settings: {
        timezone: "UTC",
        currency: "USD",
        language: "en",
        notifications: true,
    },
    contact: {},
    limits: {
        maxUsers: 100,
        maxProjects: 50,
        storageLimit: 1000,
        apiCallsPerMonth: 10000,
    },
    branding: {
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
    },
    customField: {},
    features: [],
    isActive: true,
    addOnItems: [],
    subscriptionId: null,
}

export const TenantProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<TenantFormData>(initialFormData)

    const updateFormData = (updates: Partial<TenantFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }))
    }

    const updateNestedField = (field: keyof TenantFormData, nestedField: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field] as any,
                [nestedField]: value,
            },
        }))
    }

    return (
        <TenantContext.Provider value={{ formData, updateFormData, updateNestedField }}>{children}</TenantContext.Provider>
    )
}