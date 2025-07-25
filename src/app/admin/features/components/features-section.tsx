"use client"

import { Settings, CheckSquare, Square, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePlanForm } from "@/context/plan-form-context"
import { FeatureItem } from "./feature-item"

export function FeaturesSection() {
  const { availableMenuItems, selectedMenuItems, toggleMenuItem, selectAllFeatures, deselectAllFeatures } =
    usePlanForm()

  const allSelected = selectedMenuItems.length === availableMenuItems.length
  const noneSelected = selectedMenuItems.length === 0

  const getSummaryMessage = () => {
    if (selectedMenuItems.length === 0) {
      return "⚠️ No features selected - customers won't have access to any features"
    }
    if (selectedMenuItems.length === availableMenuItems.length) {
      return "🎉 All features included - this is a premium plan"
    }
    return `✅ ${selectedMenuItems.length} features will be included in this plan`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Included Features
        </CardTitle>
        <CardDescription>Select which features are included in this plan</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Bulk Selection Controls */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Bulk Selection:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllFeatures}
              disabled={allSelected}
              className="flex items-center gap-1 bg-transparent"
            >
              <CheckSquare className="h-3 w-3" />
              Select All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={deselectAllFeatures}
              disabled={noneSelected}
              className="flex items-center gap-1 bg-transparent"
            >
              <Square className="h-3 w-3" />
              Deselect All
            </Button>
          </div>
          <div className="text-sm text-slate-600">
            <strong>{selectedMenuItems.length}</strong> of <strong>{availableMenuItems.length}</strong> selected
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMenuItems.map((item) => {
            const isSelected = selectedMenuItems.includes(item.id)
            return (
              <FeatureItem
                key={item.id}
                item={item}
                isSelected={isSelected}
                onToggle={toggleMenuItem}
              />
            )
          })}
        </div>

        {/* Selection Summary */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">{getSummaryMessage()}</p>
        </div>
      </CardContent>
    </Card>
  )
}