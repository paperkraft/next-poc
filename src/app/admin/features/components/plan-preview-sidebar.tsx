"use client"

import { Eye, Users, IndianRupeeIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePlanForm } from "@/context/plan-form-context"

export function PlanPreviewSidebar() {
    const { name, description, monthlyCost, annualCost, selectedMenuItems, availableMenuItems, isActive } = usePlanForm()

    const selectedFeatures = availableMenuItems.filter((item) => selectedMenuItems.includes(item.id))

    return (
        <div className="sticky top-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Plan Preview
                    </CardTitle>
                    <CardDescription>How this plan will appear to customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Plan Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{name || "Plan Name"}</h3>
                            <p className="text-sm text-slate-600 mt-1">{description || "Plan description will appear here"}</p>
                        </div>
                        <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
                    </div>

                    {/* Pricing Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-1">
                                <IndianRupeeIcon className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Monthly</span>
                            </div>
                            <p className="text-2xl font-bold">₹{monthlyCost.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">per month</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-1">
                                <IndianRupeeIcon className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Annual</span>
                            </div>
                            <p className="text-2xl font-bold">₹{annualCost.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">per year</p>
                            {annualCost > 0 && monthlyCost > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-slate-600">₹{(annualCost / 12).toFixed(2)}/month</p>
                                    {monthlyCost * 12 > annualCost && (
                                        <div className="mt-1">
                                            <Badge variant="secondary" className="text-green-700 bg-green-50 text-xs">
                                                Save ₹{(monthlyCost * 12 - annualCost).toFixed(2)} (
                                                {Math.round(((monthlyCost * 12 - annualCost) / (monthlyCost * 12)) * 100)}%)
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Features Preview */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium">Included Features ({selectedFeatures.length})</span>
                        </div>
                        {selectedFeatures.length > 0 ? (
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {selectedFeatures.map((feature) => (
                                    <div key={feature.id} className="flex items-center gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span>{feature.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No features selected</p>
                        )}
                    </div>

                    {/* Add-ons Note */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            <strong>Note:</strong> Additional add-ons will be available to customers during the subscription process.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
