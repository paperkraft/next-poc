"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Search, Filter, Users, GraduationCap } from "lucide-react"
import { useInstitutionForm } from "../form-provider"
import { educationalServices, educationPlans } from "../mock"
import { calculateMonthlyCost, formatPrice } from "@/utils"

export const SubscriptionAddonsSection = () => {
    const { formData, updateFormData } = useInstitutionForm()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const handlePlanSelect = (planId: number) => {
        updateFormData({ subscriptionId: planId })
    }

    const handleServiceToggle = (serviceId: number) => {
        const currentServices = formData.educationalServices || []
        const updatedServices = currentServices.includes(serviceId)
            ? currentServices.filter((id) => id !== serviceId)
            : [...currentServices, serviceId]

        updateFormData({ educationalServices: updatedServices })
    }

    const selectedPlan = educationPlans.find((plan) => plan.id === formData.subscriptionId)
    const selectedServices = educationalServices.filter((service) => formData.educationalServices.includes(service.id))

    const categories = ["all", ...Array.from(new Set(educationalServices.map((service) => service.category)))]
    const filteredServices = educationalServices.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
        return matchesSearch && matchesCategory && service.isActive
    })

    const totalMonthlyCost = (selectedPlan?.price || 0) + calculateMonthlyCost(selectedServices)

    return (
        <div className="space-y-8">
            {/* Education Plans */}
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Educational ERP Plans</h3>
                    <p className="text-sm text-gray-500">Choose the right plan for your institution's needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {educationPlans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative cursor-pointer transition-all duration-200 ${formData.subscriptionId === plan.id
                                ? "ring-2 ring-blue-500 shadow-lg"
                                : "hover:shadow-md border-gray-200"
                                }`}
                            onClick={() => handlePlanSelect(plan.id)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1">
                                        <Star className="w-3 h-3 mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl">{plan.planName}</CardTitle>
                                <div className="mt-2">
                                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-500">/{plan.billingCycle.toLowerCase()}</span>
                                </div>
                                <CardDescription className="mt-2 space-y-1">
                                    <Badge variant={plan.planType === "ENTERPRISE" ? "default" : "secondary"}>{plan.planType}</Badge>
                                    <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {plan.maxStudents === 999999 ? "Unlimited" : plan.maxStudents} Students
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" />
                                            {plan.maxFaculty === 999999 ? "Unlimited" : plan.maxFaculty} Faculty
                                        </div>
                                    </div>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <ul className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={formData.subscriptionId === plan.id ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => handlePlanSelect(plan.id)}
                                >
                                    {formData.subscriptionId === plan.id ? "Selected" : "Select Plan"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Educational Services */}
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Educational Services</h3>
                    <p className="text-sm text-gray-500">Enhance your ERP with specialized educational services</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search educational services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                    <div className="relative sm:w-48">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="pl-10 h-11">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredServices.map((service) => (
                        <Card
                            key={service.id}
                            className={`cursor-pointer transition-all duration-200 ${formData.educationalServices.includes(service.id)
                                ? "ring-2 ring-blue-500 bg-blue-50"
                                : "hover:shadow-md border-gray-200"
                                }`}
                            onClick={() => handleServiceToggle(service.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${formData.educationalServices.includes(service.id)
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {formData.educationalServices.includes(service.id) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{service.name}</CardTitle>
                                            <CardDescription className="mt-1">{service.description}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                        {service.category}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-lg">{formatPrice(service.price, service.billingCycle)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No educational services found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Billing Summary */}
            {(selectedPlan || selectedServices.length > 0) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Institution Billing Summary</h4>
                    <div className="space-y-3">
                        {selectedPlan && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700">{selectedPlan.planName} Plan</span>
                                    <div className="text-xs text-gray-500">
                                        ({selectedPlan.maxStudents === 999999 ? "Unlimited" : selectedPlan.maxStudents} students,{" "}
                                        {selectedPlan.maxFaculty === 999999 ? "Unlimited" : selectedPlan.maxFaculty} faculty)
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white">
                                    ${selectedPlan.price}/{selectedPlan.billingCycle.toLowerCase()}
                                </Badge>
                            </div>
                        )}
                        {selectedServices.map((service) => (
                            <div key={service.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{service.name}</span>
                                <Badge variant="secondary" className="bg-white">
                                    {formatPrice(service.price, service.billingCycle)}
                                </Badge>
                            </div>
                        ))}
                        <div className="border-t border-blue-200 pt-3 mt-4">
                            <div className="flex justify-between items-center font-semibold text-lg">
                                <span className="text-gray-900">Total Monthly Cost</span>
                                <Badge className="bg-blue-600 text-white text-base px-3 py-1">
                                    ${totalMonthlyCost.toFixed(2)}/month
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
