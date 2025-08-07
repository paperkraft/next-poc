"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Check } from "lucide-react"
import { useInstitutionForm } from "../form-provider"
import { availableFeatures } from "../mock"

export const BrandingFeaturesSection = () => {
    const { formData, updateFormData, updateNestedField } = useInstitutionForm()

    const toggleFeature = (feature: string) => {
        const currentFeatures = formData.features || []
        const updatedFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter((f) => f !== feature)
            : [...currentFeatures, feature]

        updateFormData({ features: updatedFeatures })
    }

    return (
        <div className="space-y-8">
            {/* Institution Branding */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Institution Branding</h3>
                    <p className="text-sm text-gray-500">Customize the visual identity of your institution</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-900">
                            Primary Color (School Colors)
                        </Label>
                        <div className="flex space-x-3">
                            <div className="relative">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={formData.branding.primaryColor || "#1e40af"}
                                    onChange={(e) => updateNestedField("branding", "primaryColor", e.target.value)}
                                    className="w-16 h-11 p-1 border rounded-lg cursor-pointer"
                                />
                            </div>
                            <Input
                                value={formData.branding.primaryColor || "#1e40af"}
                                onChange={(e) => updateNestedField("branding", "primaryColor", e.target.value)}
                                placeholder="#1e40af"
                                className="flex-1 h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="secondaryColor" className="text-sm font-medium text-gray-900">
                            Secondary Color
                        </Label>
                        <div className="flex space-x-3">
                            <div className="relative">
                                <Input
                                    id="secondaryColor"
                                    type="color"
                                    value={formData.branding.secondaryColor || "#64748b"}
                                    onChange={(e) => updateNestedField("branding", "secondaryColor", e.target.value)}
                                    className="w-16 h-11 p-1 border rounded-lg cursor-pointer"
                                />
                            </div>
                            <Input
                                value={formData.branding.secondaryColor || "#64748b"}
                                onChange={(e) => updateNestedField("branding", "secondaryColor", e.target.value)}
                                placeholder="#64748b"
                                className="flex-1 h-11"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="logo" className="text-sm font-medium text-gray-900">
                            Institution Logo URL
                        </Label>
                        <Input
                            id="logo"
                            value={formData.branding.logo || ""}
                            onChange={(e) => updateNestedField("branding", "logo", e.target.value)}
                            placeholder="https://example.com/school-logo.png"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="favicon" className="text-sm font-medium text-gray-900">
                            Favicon URL
                        </Label>
                        <Input
                            id="favicon"
                            value={formData.branding.favicon || ""}
                            onChange={(e) => updateNestedField("branding", "favicon", e.target.value)}
                            placeholder="https://example.com/favicon.ico"
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="institutionMotto" className="text-sm font-medium text-gray-900">
                        Institution Motto/Tagline
                    </Label>
                    <Input
                        id="institutionMotto"
                        value={formData.branding.institutionMotto || ""}
                        onChange={(e) => updateNestedField("branding", "institutionMotto", e.target.value)}
                        placeholder="e.g., Excellence in Education, Shaping Tomorrow's Leaders"
                        className="h-11"
                    />
                </div>
            </div>

            {/* ERP Features */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">ERP System Features</h3>
                    <p className="text-sm text-gray-500">Select the educational management features you need</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableFeatures.map((feature) => (
                        <div
                            key={feature}
                            className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.features.includes(feature)
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => toggleFeature(feature)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{feature}</span>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.features.includes(feature)
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300 group-hover:border-gray-400"
                                        }`}
                                >
                                    {formData.features.includes(feature) && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {formData.features.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Label className="text-sm font-medium text-gray-900 mb-3 block">
                            Selected Features ({formData.features.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature) => (
                                <Badge
                                    key={feature}
                                    variant="secondary"
                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                    {feature}
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleFeature(feature)
                                        }}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
