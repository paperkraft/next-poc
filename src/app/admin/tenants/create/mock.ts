import { AddOnItem, ParentTenant, Subscription } from "@/types/tenant"

export const mockParentTenants: ParentTenant[] = [
    { id: 1, name: "Acme Corporation", slug: "acme-corp" },
    { id: 2, name: "TechStart Inc", slug: "techstart" },
    { id: 3, name: "Global Solutions", slug: "global-solutions" },
]

export const availableFeatures = [
    "Advanced Analytics",
    "API Access",
    "Custom Branding",
    "Multi-tenant Support",
    "SSO Integration",
    "Advanced Security",
    "Priority Support",
    "Custom Integrations",
    "Audit Logs",
    "Data Export",
]

export const availableAddOns: AddOnItem[] = [
    {
        id: 1,
        name: "Advanced Analytics Pro",
        description: "Enhanced analytics with custom dashboards and reporting",
        price: 49.99,
        billingCycle: "MONTHLY",
        category: "Analytics",
        isActive: true,
    },
    {
        id: 2,
        name: "Priority Support",
        description: "24/7 priority support with dedicated account manager",
        price: 199.99,
        billingCycle: "MONTHLY",
        category: "Support",
        isActive: true,
    },
    {
        id: 3,
        name: "Additional Storage (1TB)",
        description: "Extra 1TB of cloud storage for your tenant",
        price: 29.99,
        billingCycle: "MONTHLY",
        category: "Storage",
        isActive: true,
    },
    {
        id: 4,
        name: "API Rate Limit Boost",
        description: "Increase API rate limits by 10x",
        price: 79.99,
        billingCycle: "MONTHLY",
        category: "API",
        isActive: true,
    },
    {
        id: 5,
        name: "White Label Solution",
        description: "Complete white-label branding solution",
        price: 499.99,
        billingCycle: "YEARLY",
        category: "Branding",
        isActive: true,
    },
    {
        id: 6,
        name: "Advanced Security Suite",
        description: "Enhanced security features including 2FA and audit logs",
        price: 99.99,
        billingCycle: "MONTHLY",
        category: "Security",
        isActive: true,
    },
]

export const availableSubscriptions: Subscription[] = [
    {
        id: 1,
        planName: "Starter",
        planType: "BASIC",
        billingCycle: "MONTHLY",
        price: 29.99,
        status: "ACTIVE",
        startDate: "2024-01-01",
        autoRenew: true,
        features: ["Basic Analytics", "Email Support", "5 Users", "10GB Storage"],
    },
    {
        id: 2,
        planName: "Professional",
        planType: "PROFESSIONAL",
        billingCycle: "MONTHLY",
        price: 99.99,
        status: "ACTIVE",
        startDate: "2024-01-01",
        autoRenew: true,
        features: ["Advanced Analytics", "Priority Support", "50 Users", "100GB Storage", "API Access"],
    },
    {
        id: 3,
        planName: "Enterprise",
        planType: "ENTERPRISE",
        billingCycle: "MONTHLY",
        price: 299.99,
        status: "ACTIVE",
        startDate: "2024-01-01",
        autoRenew: true,
        features: [
            "Full Analytics Suite",
            "24/7 Support",
            "Unlimited Users",
            "1TB Storage",
            "Full API Access",
            "Custom Integrations",
        ],
    },
    {
        id: 4,
        planName: "Professional Annual",
        planType: "PROFESSIONAL",
        billingCycle: "YEARLY",
        price: 999.99,
        status: "ACTIVE",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        autoRenew: true,
        features: ["Advanced Analytics", "Priority Support", "50 Users", "100GB Storage", "API Access"],
    },
]

export const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Tokyo", label: "Tokyo" },
]

export const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
]

export const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
]
