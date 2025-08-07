"use client"

import { IndianRupee } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceInput } from "./price-input"
import { usePlanForm } from "@/context/plan-form-context"

export function PricingSection() {
  const {
    monthlyPrice,
    setMonthlyPrice,
    annualPrice,
    setAnnualPrice,
    monthlyCost,
    annualCost,
    annualSavings,
    savingsPercentage,
  } = usePlanForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Pricing
        </CardTitle>
        <CardDescription>Set monthly and annual pricing for this plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PriceInput
            id="monthlyPrice"
            label="Monthly Price"
            value={monthlyPrice}
            onChange={setMonthlyPrice}
            placeholder="29.99"
            required
            helperText={monthlyCost > 0 ? `₹${monthlyCost.toFixed(2)} per month` : undefined}
          />
          <div className="space-y-2">
            <PriceInput
              id="annualPrice"
              label="Annual Price"
              value={annualPrice}
              onChange={setAnnualPrice}
              placeholder="299.99"
              required
            />
            {annualCost > 0 && monthlyCost > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-slate-600">₹{(annualCost / 12).toFixed(2)} per month (billed annually)</p>
                {annualSavings > 0 && (
                  <Badge variant="secondary" className="text-green-700 bg-green-50">
                    Save ₹{annualSavings.toFixed(2)} ({savingsPercentage}%)
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
