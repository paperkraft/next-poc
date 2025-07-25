"use client"

import { IndianRupeeIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PriceInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  helperText?: string
}

export function PriceInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0.00",
  required,
  helperText,
}: PriceInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <div className="relative">
        <IndianRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          id={id}
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder={placeholder}
          required={required}
        />
      </div>
      {helperText && <p className="text-sm text-slate-600">{helperText}</p>}
    </div>
  )
}
