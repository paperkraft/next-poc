"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Eye } from "lucide-react"

interface SubmitCardProps {
  onSubmit: (e: React.FormEvent) => void
}

export function SubmitCard({ onSubmit }: SubmitCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-slate-600">
            <p>Review your plan configuration in the preview when ready.</p>
            <p className="text-xs text-slate-500 mt-1">
              Customers will be able to add optional features during subscription.
            </p>
          </div>
          <div>
            <Button type="submit" size="lg" className="flex items-center gap-2" onClick={onSubmit}>
              <Save className="h-4 w-4" />
              Create Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
