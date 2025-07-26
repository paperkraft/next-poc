"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Building2, SettingsIcon, MapPin, Phone, Palette, Star, CreditCard, Package } from "lucide-react"
import { TenantProvider, useTenantContext } from "@/context/tenant-context"
import { availableAddOns, availableFeatures, availableSubscriptions, mockParentTenants } from "./mock"
import { TenantType } from "@/types/tenant"

// Basic Info Section
const BasicInfoSection: React.FC = () => {
    const { formData, updateFormData } = useTenantContext()

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
    }

    const handleNameChange = (name: string) => {
        updateFormData({
            name,
            slug: generateSlug(name),
        })
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Tenant Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Enter tenant name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => updateFormData({ slug: e.target.value })}
                        placeholder="tenant-slug"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Brief description of the tenant"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Tenant Type *</Label>
                    <Select value={formData.type} onValueChange={(value: TenantType) => updateFormData({ type: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="STARTUP">Startup</SelectItem>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="parent">Parent Tenant</Label>
                    <Select
                        value={formData.parentId?.toString() || "0"}
                        onValueChange={(value) => updateFormData({ parentId: value ? Number.parseInt(value) : null })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select parent tenant" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">No Parent</SelectItem>
                            {mockParentTenants.map((tenant) => (
                                <SelectItem key={tenant.id} value={tenant.id.toString()}>
                                    {tenant.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => updateFormData({ isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
            </div>
        </div>
    )
}

// Address Section
const AddressSection: React.FC = () => {
    const { formData, updateNestedField } = useTenantContext()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                        id="street"
                        value={formData.address.street || ""}
                        onChange={(e) => updateNestedField("address", "street", e.target.value)}
                        placeholder="123 Main Street"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={formData.address.city || ""}
                        onChange={(e) => updateNestedField("address", "city", e.target.value)}
                        placeholder="New York"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                        id="state"
                        value={formData.address.state || ""}
                        onChange={(e) => updateNestedField("address", "state", e.target.value)}
                        placeholder="NY"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                        id="zipCode"
                        value={formData.address.zipCode || ""}
                        onChange={(e) => updateNestedField("address", "zipCode", e.target.value)}
                        placeholder="10001"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        value={formData.address.country || ""}
                        onChange={(e) => updateNestedField("address", "country", e.target.value)}
                        placeholder="United States"
                    />
                </div>
            </div>
        </div>
    )
}

// Contact Section
const ContactSection: React.FC = () => {
    const { formData, updateNestedField } = useTenantContext()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.contact.email || ""}
                        onChange={(e) => updateNestedField("contact", "email", e.target.value)}
                        placeholder="contact@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={formData.contact.phone || ""}
                        onChange={(e) => updateNestedField("contact", "phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={formData.contact.website || ""}
                        onChange={(e) => updateNestedField("contact", "website", e.target.value)}
                        placeholder="https://example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="primaryContact">Primary Contact</Label>
                    <Input
                        id="primaryContact"
                        value={formData.contact.primaryContact || ""}
                        onChange={(e) => updateNestedField("contact", "primaryContact", e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
            </div>
        </div>
    )
}

// Settings Section
const SettingsSection: React.FC = () => {
    const { formData, updateNestedField } = useTenantContext()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                        value={formData.settings.timezone || "UTC"}
                        onValueChange={(value) => updateNestedField("settings", "timezone", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                        value={formData.settings.currency || "USD"}
                        onValueChange={(value) => updateNestedField("settings", "currency", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                        value={formData.settings.language || "en"}
                        onValueChange={(value) => updateNestedField("settings", "language", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="notifications"
                    checked={formData.settings.notifications || false}
                    onCheckedChange={(checked) => updateNestedField("settings", "notifications", checked)}
                />
                <Label htmlFor="notifications">Enable Notifications</Label>
            </div>
        </div>
    )
}

// Limits Section
const LimitsSection: React.FC = () => {
    const { formData, updateNestedField } = useTenantContext()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="maxUsers">Max Users</Label>
                    <Input
                        id="maxUsers"
                        type="number"
                        value={formData.limits.maxUsers || ""}
                        onChange={(e) => updateNestedField("limits", "maxUsers", Number.parseInt(e.target.value) || 0)}
                        placeholder="100"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxProjects">Max Projects</Label>
                    <Input
                        id="maxProjects"
                        type="number"
                        value={formData.limits.maxProjects || ""}
                        onChange={(e) => updateNestedField("limits", "maxProjects", Number.parseInt(e.target.value) || 0)}
                        placeholder="50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="storageLimit">Storage Limit (GB)</Label>
                    <Input
                        id="storageLimit"
                        type="number"
                        value={formData.limits.storageLimit || ""}
                        onChange={(e) => updateNestedField("limits", "storageLimit", Number.parseInt(e.target.value) || 0)}
                        placeholder="1000"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="apiCallsPerMonth">API Calls Per Month</Label>
                    <Input
                        id="apiCallsPerMonth"
                        type="number"
                        value={formData.limits.apiCallsPerMonth || ""}
                        onChange={(e) => updateNestedField("limits", "apiCallsPerMonth", Number.parseInt(e.target.value) || 0)}
                        placeholder="10000"
                    />
                </div>
            </div>
        </div>
    )
}

// Branding Section
const BrandingSection: React.FC = () => {
    const { formData, updateNestedField } = useTenantContext()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="primaryColor"
                            type="color"
                            value={formData.branding.primaryColor || "#3b82f6"}
                            onChange={(e) => updateNestedField("branding", "primaryColor", e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={formData.branding.primaryColor || "#3b82f6"}
                            onChange={(e) => updateNestedField("branding", "primaryColor", e.target.value)}
                            placeholder="#3b82f6"
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="secondaryColor"
                            type="color"
                            value={formData.branding.secondaryColor || "#64748b"}
                            onChange={(e) => updateNestedField("branding", "secondaryColor", e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            value={formData.branding.secondaryColor || "#64748b"}
                            onChange={(e) => updateNestedField("branding", "secondaryColor", e.target.value)}
                            placeholder="#64748b"
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                        id="logo"
                        value={formData.branding.logo || ""}
                        onChange={(e) => updateNestedField("branding", "logo", e.target.value)}
                        placeholder="https://example.com/logo.png"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                        id="favicon"
                        value={formData.branding.favicon || ""}
                        onChange={(e) => updateNestedField("branding", "favicon", e.target.value)}
                        placeholder="https://example.com/favicon.ico"
                    />
                </div>
            </div>
        </div>
    )
}

// Features Section
const FeaturesSection: React.FC = () => {
    const { formData, updateFormData } = useTenantContext()

    const toggleFeature = (feature: string) => {
        const currentFeatures = formData.features || []
        const updatedFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter((f) => f !== feature)
            : [...currentFeatures, feature]

        updateFormData({ features: updatedFeatures })
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableFeatures.map((feature) => (
                    <div
                        key={feature}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.features.includes(feature) ? "bg-primary/10 border-primary" : "hover:bg-muted"
                            }`}
                        onClick={() => toggleFeature(feature)}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{feature}</span>
                            {formData.features.includes(feature) && (
                                <Badge variant="secondary" className="ml-2">
                                    ✓
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <Label>Selected Features ({formData.features.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="flex items-center gap-1">
                            {feature}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleFeature(feature)} />
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Custom Fields Section
const CustomFieldsSection: React.FC = () => {
    const { formData, updateFormData } = useTenantContext()
    const [newFieldKey, setNewFieldKey] = useState("")
    const [newFieldValue, setNewFieldValue] = useState("")

    const addCustomField = () => {
        if (newFieldKey && newFieldValue) {
            updateFormData({
                customField: {
                    ...formData.customField,
                    [newFieldKey]: newFieldValue,
                },
            })
            setNewFieldKey("")
            setNewFieldValue("")
        }
    }

    const removeCustomField = (key: string) => {
        const { [key]: removed, ...rest } = formData.customField
        updateFormData({ customField: rest })
    }

    const updateCustomField = (key: string, value: string) => {
        updateFormData({
            customField: {
                ...formData.customField,
                [key]: value,
            },
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Input placeholder="Field name" value={newFieldKey} onChange={(e) => setNewFieldKey(e.target.value)} />
                <Input placeholder="Field value" value={newFieldValue} onChange={(e) => setNewFieldValue(e.target.value)} />
                <Button onClick={addCustomField} size="sm">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {Object.entries(formData.customField).map(([key, value]) => (
                    <div key={key} className="flex space-x-2">
                        <Input
                            value={key}
                            onChange={(e) => {
                                const newKey = e.target.value
                                const { [key]: oldValue, ...rest } = formData.customField
                                updateFormData({
                                    customField: {
                                        ...rest,
                                        [newKey]: oldValue,
                                    },
                                })
                            }}
                            className="flex-1"
                        />
                        <Input
                            value={value as string}
                            onChange={(e) => updateCustomField(key, e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="outline" size="sm" onClick={() => removeCustomField(key)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Subscription Section
const SubscriptionSection: React.FC = () => {
    const { formData, updateFormData } = useTenantContext()

    const handleSubscriptionSelect = (subscriptionId: number) => {
        updateFormData({ subscriptionId })
    }

    const selectedSubscription = availableSubscriptions.find((sub) => sub.id === formData.subscriptionId)

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Quick Select</Label>
                <Select
                    value={formData.subscriptionId?.toString() || "0"}
                    onValueChange={(value) => updateFormData({ subscriptionId: value ? Number.parseInt(value) : null })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a subscription plan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">No Subscription</SelectItem>
                        {availableSubscriptions.map((subscription) => (
                            <SelectItem key={subscription.id} value={subscription.id.toString()}>
                                {subscription.planName} - ${subscription.price}/{subscription.billingCycle.toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <Label>Available Plans</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableSubscriptions.map((subscription) => (
                        <Card
                            key={subscription.id}
                            className={`cursor-pointer transition-all ${formData.subscriptionId === subscription.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                            onClick={() => handleSubscriptionSelect(subscription.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{subscription.planName}</CardTitle>
                                    <Badge variant={subscription.planType === "ENTERPRISE" ? "default" : "secondary"}>
                                        {subscription.planType}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">
                                        ${subscription.price}/{subscription.billingCycle.toLowerCase()}
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Features:</h4>
                                    <ul className="space-y-1">
                                        {subscription.features.slice(0, 4).map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                                {feature}
                                            </li>
                                        ))}
                                        {subscription.features.length > 4 && (
                                            <li className="text-sm text-muted-foreground">
                                                +{subscription.features.length - 4} more features
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <Button
                                    variant={formData.subscriptionId === subscription.id ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => handleSubscriptionSelect(subscription.id)}
                                >
                                    {formData.subscriptionId === subscription.id ? "Selected" : "Select Plan"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {selectedSubscription && (
                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Selected Plan Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Plan:</span>
                            <p className="font-medium">{selectedSubscription.planName}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Price:</span>
                            <p className="font-medium">
                                ${selectedSubscription.price}/{selectedSubscription.billingCycle.toLowerCase()}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-muted-foreground">Features:</span>
                            <p className="font-medium">{selectedSubscription.features.join(", ")}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Add-ons Section
const AddOnsSection: React.FC = () => {
    const { formData, updateFormData } = useTenantContext()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const handleAddOnToggle = (addOnId: number) => {
        const currentAddOns = formData.addOnItems || []
        const updatedAddOns = currentAddOns.includes(addOnId)
            ? currentAddOns.filter((id) => id !== addOnId)
            : [...currentAddOns, addOnId]

        updateFormData({ addOnItems: updatedAddOns })
    }

    const categories = ["all", ...Array.from(new Set(availableAddOns.map((addon) => addon.category)))]

    const filteredAddOns = availableAddOns.filter((addon) => {
        const matchesSearch =
            addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            addon.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || addon.category === categoryFilter
        return matchesSearch && matchesCategory && addon.isActive
    })

    const selectedAddOns = availableAddOns.filter((addon) => formData.addOnItems.includes(addon.id))
    const totalMonthlyCost = selectedAddOns.reduce((total, addon) => {
        if (addon.billingCycle === "MONTHLY") return total + addon.price
        if (addon.billingCycle === "YEARLY") return total + addon.price / 12
        return total
    }, 0)

    const totalOneTimeCost = selectedAddOns.reduce((total, addon) => {
        return addon.billingCycle === "ONE_TIME" ? total + addon.price : total
    }, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Label htmlFor="search">Search Add-ons</Label>
                    <Input
                        id="search"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="sm:w-48">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {formData.addOnItems.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-3">Selected Add-ons ({formData.addOnItems.length})</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedAddOns.map((addon) => (
                            <Badge key={addon.id} variant="outline" className="flex items-center gap-1">
                                {addon.name}
                                <span className="text-xs">
                                    ${addon.price}/{addon.billingCycle.toLowerCase()}
                                </span>
                            </Badge>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Monthly Cost:</span>
                            <p className="font-medium">${totalMonthlyCost.toFixed(2)}/month</p>
                        </div>
                        {totalOneTimeCost > 0 && (
                            <div>
                                <span className="text-muted-foreground">One-time Cost:</span>
                                <p className="font-medium">${totalOneTimeCost.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <Label>Available Add-ons ({filteredAddOns.length})</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredAddOns.map((addon) => (
                        <Card
                            key={addon.id}
                            className={`cursor-pointer transition-all ${formData.addOnItems.includes(addon.id) ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                            onClick={() => handleAddOnToggle(addon.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-4 h-4 border-2 rounded ${formData.addOnItems.includes(addon.id) ? "bg-primary border-primary" : "border-gray-300"} mt-1`}
                                        >
                                            {formData.addOnItems.includes(addon.id) && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{addon.name}</CardTitle>
                                            <CardDescription className="mt-1">{addon.description}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{addon.category}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span>
                                        ${addon.price.toFixed(2)}/
                                        {addon.billingCycle === "ONE_TIME" ? "one-time" : addon.billingCycle.toLowerCase()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {filteredAddOns.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No add-ons found matching your criteria.</div>
                )}
            </div>
        </div>
    )
}

// Main Form Component
const TenantCreationForm: React.FC = () => {
    const { formData } = useTenantContext()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Tenant Data:", formData)
        // Here you would typically send the data to your API

    }

    return (
        <div className="mx-auto p-6">
            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
                        <TabsTrigger value="basic" className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Basic</span>
                        </TabsTrigger>
                        <TabsTrigger value="address" className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="hidden sm:inline">Address</span>
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">Contact</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-1">
                            <SettingsIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                        <TabsTrigger value="limits" className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span className="hidden sm:inline">Limits</span>
                        </TabsTrigger>
                        <TabsTrigger value="branding" className="flex items-center gap-1">
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Branding</span>
                        </TabsTrigger>
                        <TabsTrigger value="features" className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span className="hidden sm:inline">Features</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscription" className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            <span className="hidden sm:inline">Plan</span>
                        </TabsTrigger>
                        <TabsTrigger value="addons" className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span className="hidden sm:inline">Add-ons</span>
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="flex items-center gap-1">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Custom</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Configure the basic tenant information and hierarchy.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BasicInfoSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="address">
                        <Card>
                            <CardHeader>
                                <CardTitle>Address Information</CardTitle>
                                <CardDescription>Set the physical address for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AddressSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Configure contact details for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ContactSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>Configure general settings and preferences.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SettingsSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="limits">
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Limits</CardTitle>
                                <CardDescription>Set usage limits and quotas for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LimitsSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="branding">
                        <Card>
                            <CardHeader>
                                <CardTitle>Branding</CardTitle>
                                <CardDescription>Customize the visual branding for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BrandingSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="features">
                        <Card>
                            <CardHeader>
                                <CardTitle>Features</CardTitle>
                                <CardDescription>Select which features are available for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FeaturesSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscription">
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription Plan</CardTitle>
                                <CardDescription>Choose a subscription plan for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubscriptionSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="addons">
                        <Card>
                            <CardHeader>
                                <CardTitle>Add-on Items</CardTitle>
                                <CardDescription>Select additional features and services for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AddOnsSection />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="custom">
                        <Card>
                            <CardHeader>
                                <CardTitle>Custom Fields</CardTitle>
                                <CardDescription>Add custom fields specific to this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomFieldsSection />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Separator className="my-8" />

                <div className="flex justify-between">
                    <Button variant="outline" type="button">
                        Save as Draft
                    </Button>
                    <div className="space-x-2">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                        <Button type="submit">Create Tenant</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

// Main Component
export default function TenantCreation() {
    return (
        <TenantProvider>
            <TenantCreationForm />
        </TenantProvider>
    )
}
