export type TenantType = "ENTERPRISE" | "BUSINESS" | "STARTUP" | "INDIVIDUAL"

export interface Address {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
}

export interface Contact {
    email?: string
    phone?: string
    website?: string
    primaryContact?: string
}

export interface TenantSettings {
    timezone?: string
    currency?: string
    language?: string
    notifications?: boolean
}

export interface Limits {
    maxUsers?: number
    maxProjects?: number
    storageLimit?: number
    apiCallsPerMonth?: number
}

export interface Branding {
    primaryColor?: string
    secondaryColor?: string
    logo?: string
    favicon?: string
}

export interface AddOnItem {
    id: number
    name: string
    description?: string
    price: number
    billingCycle: "MONTHLY" | "YEARLY" | "ONE_TIME"
    category: string
    isActive: boolean
}

export interface Subscription {
    id: number
    planName: string
    planType: "BASIC" | "PROFESSIONAL" | "ENTERPRISE" | "CUSTOM"
    billingCycle: "MONTHLY" | "YEARLY"
    price: number
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "CANCELLED"
    startDate: string
    endDate?: string
    autoRenew: boolean
    features: string[]
}

export interface TenantFormData {
    name: string
    description: string
    slug: string
    type: TenantType
    parentId: number | null
    address: Address
    settings: TenantSettings
    contact: Contact
    limits: Limits
    branding: Branding
    customField: Record<string, any>
    features: string[]
    isActive: boolean
    addOnItems: number[] // Array of AddOnItem IDs
    subscriptionId: number | null
}

export interface ParentTenant {
    id: number
    name: string
    slug: string
}
