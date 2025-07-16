'use client'

import { cn } from "@/lib/utils"
import React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, X } from "lucide-react";

/**
 * Type for individual dropdown option.
 */
interface Option {
    label: string; // text displayed to user
    value: string | number; // actual value being sent on selection
}

interface SelectFieldProps {
    name?: string
    label: string
    options: Option[]
    value: string
    onChange: (val: string) => void
    className?: string
}

/**
 * SelectField component — A custom select dropdown field with floating label,
 * accessibility support, and theme styling.
 *
 * @param {SelectFieldProps} props - Props to control select behavior and display
 * @returns {JSX.Element} - The styled select input component
 */

export const SelectField = ({
    name,
    options,
    value,
    onChange,
    label = "Select option",
    className,
}: SelectFieldProps) => {

    const [open, setOpen] = React.useState(false)
    const selectedLabel = options.find((opt) => opt.value === value)?.label

    const handleClear = () => {
        onChange("")
        setOpen(false)
    }

    return (
        <>
            <div className={cn("relative w-full", className)}>
                {/* Floating label */}
                <label
                    className={cn(
                        "absolute left-3 top-[45%] z-10 text-sm text-muted-foreground transition-all pointer-events-none",
                        value
                            ? "-translate-y-7 left-1 scale-90 bg-background px-1"
                            : "translate-y-0 top-2.5"
                    )}
                >
                    {label}
                </label>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "w-full h-[40px] justify-between pl-3 pr-3 text-left",
                                value ? "pt-2" : ""
                            )}
                        >
                            <span className="truncate font-normal pr-4">{selectedLabel}</span>
                            {value && (
                                <button
                                    type="button"
                                    title="Clear"
                                    aria-label="Clear selection"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClear()
                                    }}
                                    className="absolute right-2.5 top-2.5 size-5 text-muted-foreground hover:text-red-500 z-10"
                                >
                                    <X />
                                </button>
                            )}
                            {!value && (
                                <ChevronDown className="size-4 shrink-0 opacity-50" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        sideOffset={4}
                        className="w-[--radix-popover-trigger-width] p-0"
                    >
                        <Command>
                            <CommandInput placeholder="Search..." />
                            <CommandEmpty>No match found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            onChange(option.value.toString())
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 size-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}