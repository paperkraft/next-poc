"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface MenuItem {
  id: number
  name: string
  description?: string
}

interface PlanFormContextType {
  // Basic plan details
  name: string
  setName: (name: string) => void
  description: string
  setDescription: (description: string) => void
  isActive: boolean
  setIsActive: (active: boolean) => void

  // Pricing
  monthlyPrice: string
  setMonthlyPrice: (price: string) => void
  annualPrice: string
  setAnnualPrice: (price: string) => void

  // Features
  availableMenuItems: MenuItem[]
  selectedMenuItems: number[]
  toggleMenuItem: (id: number) => void
  selectAllFeatures: () => void
  deselectAllFeatures: () => void

  // Computed values
  monthlyCost: number
  annualCost: number
  annualSavings: number
  savingsPercentage: number
}

const PlanFormContext = createContext<PlanFormContextType | undefined>(undefined)

const mockMenuItems: MenuItem[] = [
  { id: 1, name: "Dashboard", description: "Main overview and analytics" },
  { id: 2, name: "Reports", description: "Generate and view reports" },
  { id: 3, name: "Analytics", description: "Advanced data insights" },
  { id: 4, name: "User Management", description: "Manage team members" },
  { id: 5, name: "API Access", description: "Programmatic access" },
  { id: 6, name: "Integrations", description: "Third-party connections" },
  { id: 7, name: "Custom Branding", description: "White-label options" },
  { id: 8, name: "Advanced Security", description: "Enhanced security features" },
  { id: 9, name: "Data Export", description: "Export data in multiple formats" },
  { id: 10, name: "Priority Support", description: "Faster response times" },
]

export function PlanFormProvider({ children }: { children: React.ReactNode }) {
  // Basic plan details
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)

  // Pricing
  const [monthlyPrice, setMonthlyPrice] = useState("")
  const [annualPrice, setAnnualPrice] = useState("")

  // Features
  const [selectedMenuItems, setSelectedMenuItems] = useState<number[]>([])

  // Computed values
  const monthlyCost = Number.parseFloat(monthlyPrice) || 0
  const annualCost = Number.parseFloat(annualPrice) || 0
  const annualSavings = monthlyCost * 12 - annualCost
  const savingsPercentage = monthlyCost > 0 ? Math.round((annualSavings / (monthlyCost * 12)) * 100) : 0

  // Feature management functions
  const toggleMenuItem = (id: number) => {
    setSelectedMenuItems((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const selectAllFeatures = () => {
    setSelectedMenuItems(mockMenuItems.map((item) => item.id))
  }

  const deselectAllFeatures = () => {
    setSelectedMenuItems([])
  }

  const contextValue: PlanFormContextType = {
    // Basic plan details
    name,
    setName,
    description,
    setDescription,
    isActive,
    setIsActive,

    // Pricing
    monthlyPrice,
    setMonthlyPrice,
    annualPrice,
    setAnnualPrice,

    // Features
    availableMenuItems: mockMenuItems,
    selectedMenuItems,
    toggleMenuItem,
    selectAllFeatures,
    deselectAllFeatures,

    // Computed values
    monthlyCost,
    annualCost,
    annualSavings,
    savingsPercentage,
  }

  return <PlanFormContext.Provider value={contextValue}>{children}</PlanFormContext.Provider>
}

export function usePlanForm() {
  const context = useContext(PlanFormContext)
  if (context === undefined) {
    throw new Error("usePlanForm must be used within a PlanFormProvider")
  }
  return context
}
