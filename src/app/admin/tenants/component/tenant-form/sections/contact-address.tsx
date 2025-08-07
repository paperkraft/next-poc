"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInstitutionForm } from "../form-provider"

export const ContactAddressSection = () => {
    const { formData, updateNestedField } = useInstitutionForm()

    return (
        <div className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-sm text-gray-500">Primary contact details for your institution</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                            Official Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.contact.email || ""}
                            onChange={(e) => updateNestedField("contact", "email", e.target.value)}
                            placeholder="info@springfieldhigh.edu"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                            Main Phone Number
                        </Label>
                        <Input
                            id="phone"
                            value={formData.contact.phone || ""}
                            onChange={(e) => updateNestedField("contact", "phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-medium text-gray-900">
                            Institution Website
                        </Label>
                        <Input
                            id="website"
                            value={formData.contact.website || ""}
                            onChange={(e) => updateNestedField("contact", "website", e.target.value)}
                            placeholder="https://www.springfieldhigh.edu"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalName" className="text-sm font-medium text-gray-900">
                            Principal/Director Name
                        </Label>
                        <Input
                            id="principalName"
                            value={formData.contact.principalName || ""}
                            onChange={(e) => updateNestedField("contact", "principalName", e.target.value)}
                            placeholder="Dr. Jane Smith"
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="registrarEmail" className="text-sm font-medium text-gray-900">
                            Registrar Email
                        </Label>
                        <Input
                            id="registrarEmail"
                            type="email"
                            value={formData.contact.registrarEmail || ""}
                            onChange={(e) => updateNestedField("contact", "registrarEmail", e.target.value)}
                            placeholder="registrar@springfieldhigh.edu"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admissionsPhone" className="text-sm font-medium text-gray-900">
                            Admissions Phone
                        </Label>
                        <Input
                            id="admissionsPhone"
                            value={formData.contact.admissionsPhone || ""}
                            onChange={(e) => updateNestedField("contact", "admissionsPhone", e.target.value)}
                            placeholder="+1 (555) 123-4568"
                            className="h-11"
                        />
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Campus Address</h3>
                    <p className="text-sm text-gray-500">Physical address of your main campus</p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="street" className="text-sm font-medium text-gray-900">
                                Street Address
                            </Label>
                            <Input
                                id="street"
                                value={formData.address.street || ""}
                                onChange={(e) => updateNestedField("address", "street", e.target.value)}
                                placeholder="123 Education Boulevard"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium text-gray-900">
                                City
                            </Label>
                            <Input
                                id="city"
                                value={formData.address.city || ""}
                                onChange={(e) => updateNestedField("address", "city", e.target.value)}
                                placeholder="Springfield"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm font-medium text-gray-900">
                                State/Province
                            </Label>
                            <Input
                                id="state"
                                value={formData.address.state || ""}
                                onChange={(e) => updateNestedField("address", "state", e.target.value)}
                                placeholder="Illinois"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipCode" className="text-sm font-medium text-gray-900">
                                ZIP/Postal Code
                            </Label>
                            <Input
                                id="zipCode"
                                value={formData.address.zipCode || ""}
                                onChange={(e) => updateNestedField("address", "zipCode", e.target.value)}
                                placeholder="62701"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium text-gray-900">
                                Country
                            </Label>
                            <Input
                                id="country"
                                value={formData.address.country || ""}
                                onChange={(e) => updateNestedField("address", "country", e.target.value)}
                                placeholder="United States"
                                className="h-11"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
