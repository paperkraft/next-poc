"use client"

import type React from "react"

import { toast } from "sonner"
import { PlanDetailsSection } from "./components/plan-details-section"
import { PricingSection } from "./components/pricing-section"
import { FeaturesSection } from "./components/features-section"
import { SubmitCard } from "./components/submit-card"
import { PlanFormProvider, usePlanForm } from "@/context/plan-form-context"
import { PlanPreviewSidebar } from "./components/plan-preview-sidebar"

function PlanFormContent() {
  const { name, description, monthlyPrice, annualPrice, isActive, selectedMenuItems } = usePlanForm()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      toast.error("Plan name is required")
      return
    }

    if (!monthlyPrice || !annualPrice) {
      toast.error("Both monthly and annual pricing are required")
      return
    }

    if (selectedMenuItems.length === 0) {
      toast.error("Please select at least one feature for this plan")
      return
    }

    const monthlyCost = Number.parseFloat(monthlyPrice)
    const annualCost = Number.parseFloat(annualPrice)

    if (monthlyCost <= 0 || annualCost <= 0) {
      toast.error("Prices must be greater than 0")
      return
    }

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        monthlyPrice: monthlyCost,
        annualPrice: annualCost,
        isActive,
        includedFeatures: selectedMenuItems,
        createdAt: new Date().toISOString(),
      }

      console.log("Creating subscription plan:", payload)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`Plan "${name}" created successfully!`)

      // Here you would typically redirect to plans list or reset form
    } catch (error) {
      console.error("Error creating plan:", error)
      toast.error("Failed to create plan. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit} className="space-y-6">
              <PlanDetailsSection />
              <PricingSection />
              <FeaturesSection />
              <SubmitCard onSubmit={onSubmit} />
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PlanPreviewSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlanForm() {
  return (
    <PlanFormProvider>
      <PlanFormContent />
    </PlanFormProvider>
  )
}
