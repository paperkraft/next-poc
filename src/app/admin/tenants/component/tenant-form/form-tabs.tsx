"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, MapPin, Settings, Palette, CreditCard, Wrench } from "lucide-react"
import { BasicInfoSection } from "./sections/basic-info"
import { ContactAddressSection } from "./sections/contact-address"
import { SettingsLimitsSection } from "./sections/settings-limits"
import { BrandingFeaturesSection } from "./sections/branding-features"
import { SubscriptionAddonsSection } from "./sections/subscription-addons"
import { CustomFieldsSection } from "./sections/custom-fields"

export const InstitutionFormTabs = () => {
    return (
        <Tabs defaultValue="basic" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-12 rounded-xl px-3">
                <TabsTrigger
                    value="basic"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <GraduationCap className="w-4 h-4" />
                    <span className="hidden sm:inline">Institution</span>
                </TabsTrigger>
                <TabsTrigger
                    value="contact"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">Contact</span>
                </TabsTrigger>
                <TabsTrigger
                    value="settings"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                <TabsTrigger
                    value="branding"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">Branding</span>
                </TabsTrigger>
                <TabsTrigger
                    value="subscription"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">Plans</span>
                </TabsTrigger>
                <TabsTrigger
                    value="custom"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <Wrench className="w-4 h-4" />
                    <span className="hidden sm:inline">Custom</span>
                </TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <TabsContent value="basic" className="mt-0">
                    <BasicInfoSection />
                </TabsContent>

                <TabsContent value="contact" className="mt-0">
                    <ContactAddressSection />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    <SettingsLimitsSection />
                </TabsContent>

                <TabsContent value="branding" className="mt-0">
                    <BrandingFeaturesSection />
                </TabsContent>

                <TabsContent value="subscription" className="mt-0">
                    <SubscriptionAddonsSection />
                </TabsContent>

                <TabsContent value="custom" className="mt-0">
                    <CustomFieldsSection />
                </TabsContent>
            </div>
        </Tabs>
    )
}
