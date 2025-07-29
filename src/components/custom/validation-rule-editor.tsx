"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import type { ColumnMapping } from "./csv-importer"

// Define the structure for a custom validation rule
export type ValidationRuleType =
    | "regex"
    | "minLength"
    | "maxLength"
    | "minValue"
    | "maxValue"
    | "required"
    | "regex_numbers" // New: Only numbers
    | "regex_characters" // New: Only characters (letters and spaces)
    | "regex_alphanumeric" // New: Alphanumeric (letters, numbers, and spaces)
    | "regex_email" // New: Email Format
    | "unique" // New: Field must be unique

export type CustomValidationRule = {
    id: string // Unique ID for React keys and easy management
    fieldName: string // The custom field name this rule applies to
    ruleType: ValidationRuleType
    ruleValue?: string | number // Value for the rule (e.g., regex string, min/max length/value)
}

// Predefined regex patterns
const PREDEFINED_REGEX: Record<string, string> = {
    regex_numbers: "^\\d+$",
    regex_characters: "^[a-zA-Z\\s]+$",
    regex_alphanumeric: "^[a-zA-Z0-9\\s]+$",
    regex_email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
}

interface ValidationRuleEditorProps {
    columnMappings: ColumnMapping[]
    initialRules: CustomValidationRule[]
    onSave: (rules: CustomValidationRule[]) => void
}

export function ValidationRuleEditor({ columnMappings, initialRules, onSave }: ValidationRuleEditorProps) {
    const [rules, setRules] = React.useState<CustomValidationRule[]>(initialRules)
    const [isOpen, setIsOpen] = React.useState(false)

    // Filter out ignored columns and ensure they have a customFieldName
    const availableFields = columnMappings
        .filter((m) => m.confirmedField === "custom" && m.customFieldName)
        .map((m) => m.customFieldName!)
        .filter((name, index, self) => self.indexOf(name) === index) // Ensure unique names

    React.useEffect(() => {
        setRules(initialRules)
    }, [initialRules])

    const addRule = () => {
        setRules((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                fieldName: availableFields[0] || "", // Default to first available field
                ruleType: "required", // Default rule type
                ruleValue: undefined,
            },
        ])
    }

    const updateRule = (id: string, key: keyof CustomValidationRule, value: any) => {
        setRules((prev) => {
            const newRules = prev.map((rule) => {
                if (rule.id === id) {
                    const updatedRule = { ...rule, [key]: value }
                    // If ruleType changes to a predefined regex, set ruleValue
                    if (key === "ruleType" && PREDEFINED_REGEX[value as string]) {
                        updatedRule.ruleValue = PREDEFINED_REGEX[value as string]
                    } else if (
                        key === "ruleType" &&
                        (value === "unique" || (!PREDEFINED_REGEX[value as string] && value !== "regex"))
                    ) {
                        // Clear ruleValue if not a regex type or if it's a unique type
                        updatedRule.ruleValue = undefined
                    }
                    return updatedRule
                }
                return rule
            })
            return newRules
        })
    }

    const deleteRule = (id: string) => {
        setRules((prev) => prev.filter((rule) => rule.id !== id))
    }

    const handleSave = () => {
        onSave(rules)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="ml-auto bg-transparent">
                    <Plus className="h-4 w-4 mr-2" /> Define Validation Rules
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Define Custom Validation Rules</DialogTitle>
                    <DialogDescription>
                        Add rules to validate your imported data. These rules will be applied in the Repair step.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {rules.length === 0 && (
                        <div className="text-center text-gray-500 py-8 border border-dashed rounded-md">
                            No custom rules defined yet. Click "Add Rule" to get started.
                        </div>
                    )}
                    {rules.map((rule) => (
                        <div key={rule.id} className="flex flex-col gap-3 border p-4 rounded-md relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => deleteRule(rule.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`field-${rule.id}`}>Applies to Field</Label>
                                    <Select value={rule.fieldName} onValueChange={(value) => updateRule(rule.id, "fieldName", value)}>
                                        <SelectTrigger id={`field-${rule.id}`}>
                                            <SelectValue placeholder="Select a field" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableFields.length === 0 && (
                                                <SelectItem value="no-fields" disabled>
                                                    No custom fields defined
                                                </SelectItem>
                                            )}
                                            {availableFields.map((field) => (
                                                <SelectItem key={field} value={field}>
                                                    {field}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {availableFields.length === 0 && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> Map columns to custom fields first.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor={`rule-type-${rule.id}`}>Rule Type</Label>
                                    <Select
                                        value={rule.ruleType}
                                        onValueChange={(value: ValidationRuleType) => updateRule(rule.id, "ruleType", value)}
                                    >
                                        <SelectTrigger id={`rule-type-${rule.id}`}>
                                            <SelectValue placeholder="Select rule type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="required">Required</SelectItem>
                                            <SelectItem value="unique">Unique Value</SelectItem> {/* New unique rule */}
                                            <SelectItem value="regex">Custom Regex Match</SelectItem>
                                            <SelectItem value="regex_numbers">Regex: Only Numbers</SelectItem>
                                            <SelectItem value="regex_characters">Regex: Only Characters (A-Z, spaces)</SelectItem>
                                            <SelectItem value="regex_alphanumeric">Regex: Alphanumeric (A-Z, 0-9, spaces)</SelectItem>
                                            <SelectItem value="regex_email">Regex: Email Format</SelectItem>
                                            <SelectItem value="minLength">Min Length</SelectItem>
                                            <SelectItem value="maxLength">Max Length</SelectItem>
                                            <SelectItem value="minValue">Min Value (Number)</SelectItem>
                                            <SelectItem value="maxValue">Max Value (Number)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {(rule.ruleType === "regex" ||
                                rule.ruleType === "minLength" ||
                                rule.ruleType === "maxLength" ||
                                rule.ruleType === "minValue" ||
                                rule.ruleType === "maxValue" ||
                                rule.ruleType === "regex_numbers" || // Include new regex types
                                rule.ruleType === "regex_email" ||
                                rule.ruleType === "regex_characters" ||
                                rule.ruleType === "regex_alphanumeric") && (
                                    <div className="w-full">
                                        <Label htmlFor={`rule-value-${rule.id}`}>Rule Value</Label>
                                        <Input
                                            id={`rule-value-${rule.id}`}
                                            type={
                                                rule.ruleType === "minLength" ||
                                                    rule.ruleType === "maxLength" ||
                                                    rule.ruleType === "minValue" ||
                                                    rule.ruleType === "maxValue"
                                                    ? "number"
                                                    : "text"
                                            }
                                            value={rule.ruleValue ?? ""}
                                            onChange={(e) =>
                                                updateRule(
                                                    rule.id,
                                                    "ruleValue",
                                                    rule.ruleType === "minLength" ||
                                                        rule.ruleType === "maxLength" ||
                                                        rule.ruleType === "minValue" ||
                                                        rule.ruleType === "maxValue"
                                                        ? Number(e.target.value)
                                                        : e.target.value,
                                                )
                                            }
                                            placeholder={
                                                rule.ruleType === "regex"
                                                    ? "e.g., ^\\d{5}$ for 5 digits"
                                                    : rule.ruleType === "minLength"
                                                        ? "Minimum length"
                                                        : rule.ruleType === "maxLength"
                                                            ? "Maximum length"
                                                            : rule.ruleType === "minValue"
                                                                ? "Minimum value"
                                                                : rule.ruleType === "maxValue"
                                                                    ? "Maximum value"
                                                                    : ""
                                            }
                                            className="mt-1"
                                            // Disable input if it's a predefined regex type, but allow custom regex to be edited
                                            disabled={
                                                rule.ruleType === "regex_email" ||
                                                rule.ruleType === "regex_numbers" ||
                                                rule.ruleType === "regex_characters" ||
                                                rule.ruleType === "regex_alphanumeric"
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    ))}
                    <Button variant="outline" onClick={addRule} className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" /> Add Rule
                    </Button>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Rules</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
