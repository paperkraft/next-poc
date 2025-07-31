"use client"

import Papa from "papaparse"
import React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import {
    Trash2,
    Upload,
    Plus,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Info,
    ArrowUp,
    ArrowDown,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ValidationRuleEditor, type CustomValidationRule } from "./validation-rule-editor"

// Define Row as a generic record, as its structure is now entirely dynamic
export type Row = Record<string, any>

// WizardRow is now effectively the same as Row, but kept for clarity in flow
type WizardRow = Row

// RowErrors type is now used to store validation messages per cell
type RowErrors = Record<number, Partial<Record<string, string[]>>>

export async function saveRows(rows: WizardRow[]) {
    // No Zod validation here, as there's no fixed schema.
    // The data is accepted as is after user's repair/mapping.
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("✔️ rows accepted:", rows.length)
    console.log("✔️ data:", rows)
}

type ImportStep = "upload" | "match" | "repair" | "complete"

// Define possible inferred data types
type DataType = "string" | "number" | "boolean" | "date" | "unknown"

export type ColumnMapping = {
    csvColumnIndex: number
    csvHeader: string
    suggestedField: null // Always null as no predefined fields
    confirmedField: "ignore" | "custom" | null // Only these options
    customFieldName?: string
    hasValuePercentage: number
    validationStatus: "unmatched" // Always unmatched as no predefined validation
    validationMessages: string[]
    previewData: string[]
    inferredDataType: DataType // Added for inferred data type
}

// Helper to get column letters (A, B, C...)
const getColumnLetters = (numColumns: number) => {
    const letters = []
    for (let i = 0; i < numColumns; i++) {
        letters.push(String.fromCharCode(65 + i)) // A, B, C...
    }
    return letters
}

// --- Utility functions for deep comparison ---
const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) return false

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false
        }
    }
    return true
}

const setEqual = (set1: Set<number>, set2: Set<number>): boolean => {
    if (set1.size !== set2.size) return false
    for (const item of set1) {
        if (!set2.has(item)) {
            return false
        }
    }
    return true
}

// --- Data Type Inference Utility ---
function inferDataType(values: string[]): DataType {
    if (values.length === 0) return "unknown"

    const nonNullValues = values.filter((v) => v !== null && v !== undefined && v.trim() !== "")

    if (nonNullValues.length === 0) return "unknown" // Or 'string' if preferred for empty columns

    let allNumbers = true
    let allBooleans = true
    let allDates = true

    for (const value of nonNullValues) {
        // Check for number
        if (isNaN(Number(value)) || value.trim() === "") {
            allNumbers = false
        }

        // Check for boolean
        const lowerValue = value.toLowerCase()
        if (lowerValue !== "true" && lowerValue !== "false") {
            allBooleans = false
        }

        // Check for date (basic check for common date formats)
        try {
            const date = new Date(value)
            if (isNaN(date.getTime()) || value.trim() === "") {
                allDates = false
            }
        } catch {
            allDates = false
        }

        // If we've already determined it's not all of these, no need to continue checking for this value
        if (!allNumbers && !allBooleans && !allDates) {
            break
        }
    }

    if (allNumbers) return "number"
    if (allBooleans) return "boolean"
    if (allDates) return "date"

    return "string" // Default to string if no other type fits consistently
}

// --- Utility to clean up and format field names (e.g., for custom fields) ---
const cleanFieldName = (header: string): string => {
    // Remove non-alphanumeric characters (except spaces) and trim
    const cleaned = header.replace(/[^a-zA-Z0-9\s]/g, "").trim()
    if (!cleaned) return "" // Return empty if nothing left after cleaning

    // Convert to camelCase
    return cleaned
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, "") // Remove all spaces
}

// --- UploadStep Component ---
interface UploadStepProps {
    onFileSelect: (file: File) => void
    isLoading: boolean
    isDragOver: boolean
    setIsDragOver: React.Dispatch<React.SetStateAction<boolean>>
    fileInputRef: React.RefObject<HTMLInputElement>
}

function UploadStep({ onFileSelect, isLoading, isDragOver, setIsDragOver, fileInputRef }: UploadStepProps) {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type === "text/csv") {
            onFileSelect(file)
        } else {
            toast.error("Please upload a CSV file")
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) onFileSelect(file)
    }

    return (
        <div
            className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-gray-400"}
      `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
        >
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileInput} className="hidden" />
            {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-gray-600">Processing CSV file...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-lg font-medium">Drop your CSV file here or click to browse</p>
                    <p className="text-sm text-gray-500">Supports any CSV file format</p>
                </div>
            )}
        </div>
    )
}

// --- MatchStep Component ---
interface MatchStepProps {
    rawData: string[][]
    fileName: string
    headerRowIndex: number | null // Still passed, but not used for UI interaction here
    onGoBack: () => void
    onNext: (mappedColumns: ColumnMapping[], customValidationRules: CustomValidationRule[]) => void
    initialCustomValidationRules: CustomValidationRule[]
}

function MatchStep({
    rawData,
    fileName,
    headerRowIndex,
    onGoBack,
    onNext,
    initialCustomValidationRules,
}: MatchStepProps) {
    const [columnMappings, setColumnMappings] = React.useState<ColumnMapping[]>([])
    const [customValidationRules, setCustomValidationRules] =
        React.useState<CustomValidationRule[]>(initialCustomValidationRules)

    const initializeColumnMappings = React.useCallback(() => {
        if (rawData.length === 0) return []

        // Use the headerRowIndex passed from parent (which defaults to 0)
        const headers =
            headerRowIndex !== null && headerRowIndex !== -1
                ? rawData[headerRowIndex].map((h) => h.trim()) // Keep original case for custom field suggestion
                : getColumnLetters(rawData[0].length) // Fallback to A, B, C if no header row

        const newMappings: ColumnMapping[] = headers.map((header, index) => {
            const columnData = rawData
                .slice(headerRowIndex !== null && headerRowIndex !== -1 ? headerRowIndex + 1 : 0)
                .map((row) => row[index])
            const hasValueCount = columnData.filter(
                (cell) => cell !== undefined && cell !== null && cell.trim() !== "",
            ).length
            const hasValuePercentage = columnData.length > 0 ? Math.round((hasValueCount / columnData.length) * 100) : 0

            const inferredDataType = inferDataType(columnData) // Infer data type
            const cleanedHeader = cleanFieldName(header)
            const defaultConfirmedField: "ignore" | "custom" | null = hasValuePercentage < 10 ? "ignore" : "custom" // Heuristic: ignore if less than 10% values

            return {
                csvColumnIndex: index,
                csvHeader: header, // Use the actual header or letter
                suggestedField: null, // No predefined suggestions
                confirmedField: defaultConfirmedField, // Auto-suggest ignore or custom based on value presence
                customFieldName: cleanedHeader || `column_${index + 1}`, // Use cleaned header or fallback
                hasValuePercentage,
                validationStatus: "unmatched", // No validation performed
                validationMessages: [],
                previewData: columnData.slice(0, 3), // Show first 3 data rows
                inferredDataType, // Store inferred data type
            }
        })
        setColumnMappings(newMappings)
    }, [rawData, headerRowIndex])

    React.useEffect(() => {
        initializeColumnMappings()
    }, [initializeColumnMappings])

    const handleMappingTypeChange = (index: number, value: "ignore" | "custom") => {
        setColumnMappings((prev) => {
            const newMappings = [...prev]
            newMappings[index].confirmedField = value
            // If switching to custom, ensure customFieldName is set
            if (value === "custom" && !newMappings[index].customFieldName) {
                newMappings[index].customFieldName = cleanFieldName(newMappings[index].csvHeader) || `column_${index + 1}`
            }
            return newMappings
        })
    }

    const handleCustomFieldNameChange = (index: number, value: string) => {
        setColumnMappings((prev) => {
            const newMappings = [...prev]
            // Apply cleanFieldName to enforce camelCase and remove spaces
            newMappings[index].customFieldName = cleanFieldName(value)
            return newMappings
        })
    }

    const allColumnsMapped = columnMappings.every(
        (col) =>
            col.confirmedField !== null &&
            (col.confirmedField !== "custom" || (col.customFieldName && col.customFieldName.trim() !== "")),
    )

    return (
        <>
            {/* File name display and Validation Rules button */}
            <div className="text-sm font-medium flex justify-between items-center">
                <span>{fileName}</span>
                <ValidationRuleEditor
                    columnMappings={columnMappings}
                    initialRules={customValidationRules}
                    onSave={setCustomValidationRules}
                />
            </div>

            {/* Column Mapping Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {columnMappings.map((col, index) => (
                    <div key={col.csvColumnIndex} className="border rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-xl font-bold w-8 text-center">
                                {getColumnLetters(rawData[0].length)[col.csvColumnIndex]}
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4 items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">CSV Column Header</span>
                                    <span className="font-semibold">{col.csvHeader}</span>
                                    <Badge variant="secondary" className="mt-1 w-fit capitalize">
                                        Inferred: {col.inferredDataType}
                                    </Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Maps to</span>
                                    <Select
                                        onValueChange={(value: "ignore" | "custom") => handleMappingTypeChange(index, value)}
                                        value={col.confirmedField || ""}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select mapping" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore">Ignore this column</SelectItem>
                                            <SelectItem value="custom">Map to a field</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {col.confirmedField === "custom" && (
                                        <Input
                                            value={col.customFieldName || ""}
                                            onChange={(e) => handleCustomFieldNameChange(index, e.target.value)}
                                            placeholder="Enter custom field name"
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Validation Status - Simplified */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                {col.confirmedField === "ignore" && <span className="text-muted-foreground">This column will be ignored.</span>}
                                {col.confirmedField === "custom" && (
                                    <span className="text-muted-foreground">
                                        This column will be included as a custom field: "
                                        <span className="font-semibold">{col.customFieldName || "Unnamed Custom Field"}</span>"
                                    </span>
                                )}
                                {col.confirmedField === null && (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                        <span>Please select a mapping for this column.</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Info className="h-4 w-4 text-muted-foreground" />
                                <span>{col.hasValuePercentage}% of your rows have a value for this column</span>
                            </div>
                        </div>

                        {/* Mini Table Preview */}
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full table-fixed text-sm">
                                <thead>
                                    <tr className="bg-sidebar">
                                        <th className="w-[50px] p-2 text-center border-r">#</th>
                                        <th className="p-2 text-left">{col.csvHeader}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {col.previewData.map((cell, rowIndex) => (
                                        <tr key={rowIndex} className="border-t">
                                            <td className="w-[50px] p-2 text-center text-muted-foreground border-r">
                                                {rowIndex + 1}
                                            </td>
                                            <td className="p-2">{cell}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="p-6 border-t flex justify-between">
                <Button variant="secondary" onClick={onGoBack}>
                    Go back
                </Button>
                <Button
                    onClick={() => onNext(columnMappings, customValidationRules)}
                    disabled={!allColumnsMapped}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    Next
                </Button>
            </div>
        </>
    )
}

// --- RepairStep Component ---
interface RepairStepProps {
    initialMappedData: WizardRow[]
    columnMappings: ColumnMapping[]
    customValidationRules: CustomValidationRule[] // New prop for custom rules
    onGoBack: () => void
    onNext: (finalRows: WizardRow[]) => void // Now passes WizardRow[]
}

function RepairStep({ initialMappedData, columnMappings, customValidationRules, onGoBack, onNext }: RepairStepProps) {
    const [rows, setRows] = React.useState<WizardRow[]>(initialMappedData)
    const [errors, setErrors] = React.useState<RowErrors>({})
    const [duplicateEntryErrors, setDuplicateEntryErrors] = React.useState<Set<number>>(new Set())
    const [editingCell, setEditingCell] = React.useState<{ row: number; field: string } | null>(null)
    const [searchTerm, setSearchTerm] = React.useState<string>("")
    const [sortConfig, setSortConfig] = React.useState<{ key: string | null; direction: "asc" | "desc" | null }>({
        key: null,
        direction: null,
    })

    // Pagination states
    const [currentPage, setCurrentPage] = React.useState(1)
    const pageSize = 10 // Default page size

    // Memoize column mappings and custom validation rules to prevent unnecessary re-renders of validation logic
    const memoizedColumnMappings = React.useMemo(() => columnMappings, [columnMappings])
    const memoizedCustomValidationRules = React.useMemo(() => customValidationRules, [customValidationRules])

    const performValidation = React.useCallback(
        (
            currentRows: WizardRow[],
            currentColumnMappings: ColumnMapping[],
            currentCustomValidationRules: CustomValidationRule[],
        ) => {
            const newErrors: RowErrors = {}
            const newDuplicateEntryErrors = new Set<number>()

            // Collect unique field rules
            const uniqueFieldRules = currentCustomValidationRules.filter((rule) => rule.ruleType === "unique")
            const uniqueFieldValues: Record<string, Map<string, number[]>> = {} // { fieldName: { value: [rowIndices] } }

            uniqueFieldRules.forEach((rule) => {
                uniqueFieldValues[rule.fieldName] = new Map<string, number[]>()
            })

            currentRows.forEach((row, rowIndex) => {
                const rowError: Partial<Record<string, string[]>> = {}
                let isCurrentRowEffectivelyEmpty = true // Assume empty until a non-empty mapped field is found

                currentColumnMappings
                    .filter((m) => m.confirmedField && m.confirmedField !== "ignore")
                    .forEach((mapping) => {
                        const fieldName = mapping.confirmedField === "custom" ? mapping.customFieldName! : mapping.confirmedField!
                        const value = row[fieldName]
                        const cellValue = String(value || "").trim() // Ensure value is a string for checks

                        if (cellValue !== "") {
                            isCurrentRowEffectivelyEmpty = false // If any mapped field has a value, it's not effectively empty
                        }

                        const fieldErrors: string[] = []

                        // 1. Data Type Validation (inferred)
                        if (cellValue !== "") {
                            // Only validate type if there's a value
                            switch (mapping.inferredDataType) {
                                case "number":
                                    if (isNaN(Number(cellValue))) {
                                        fieldErrors.push(`Expected a number, got "${cellValue}"`)
                                    }
                                    break
                                case "boolean":
                                    if (cellValue.toLowerCase() !== "true" && cellValue.toLowerCase() !== "false") {
                                        fieldErrors.push(`Expected "true" or "false", got "${cellValue}"`)
                                    }
                                    break
                                case "date":
                                    if (isNaN(new Date(cellValue).getTime())) {
                                        fieldErrors.push(`Expected a date, got "${cellValue}"`)
                                    }
                                    break
                                // String and unknown types don't have inherent format validation here
                            }
                        }

                        // 4. Apply Custom Validation Rules (excluding 'unique' for now, handled separately below)
                        currentCustomValidationRules
                            .filter((rule) => rule.fieldName === fieldName && rule.ruleType !== "unique")
                            .forEach((rule) => {
                                switch (rule.ruleType) {
                                    case "required":
                                        if (!cellValue) {
                                            fieldErrors.push("This field is required.")
                                        }
                                        break
                                    case "regex":
                                    case "regex_numbers":
                                    case "regex_characters":
                                    case "regex_alphanumeric":
                                    case "regex_email":
                                        if (rule.ruleValue && cellValue && !new RegExp(String(rule.ruleValue)).test(cellValue)) {
                                            fieldErrors.push(`Does not match required format: ${rule.ruleValue}`)
                                        }
                                        break
                                    case "minLength":
                                        if (rule.ruleValue !== undefined && cellValue.length < Number(rule.ruleValue)) {
                                            fieldErrors.push(`Minimum length is ${rule.ruleValue} characters.`)
                                        }
                                        break
                                    case "maxLength":
                                        if (rule.ruleValue !== undefined && cellValue.length > Number(rule.ruleValue)) {
                                            fieldErrors.push(`Maximum length is ${rule.ruleValue} characters.`)
                                        }
                                        break
                                    case "minValue":
                                        if (
                                            rule.ruleValue !== undefined &&
                                            !isNaN(Number(cellValue)) &&
                                            Number(cellValue) < Number(rule.ruleValue)
                                        ) {
                                            fieldErrors.push(`Minimum value is ${rule.ruleValue}.`)
                                        }
                                        break
                                    case "maxValue":
                                        if (
                                            rule.ruleValue !== undefined &&
                                            !isNaN(Number(cellValue)) &&
                                            Number(cellValue) > Number(rule.ruleValue)
                                        ) {
                                            fieldErrors.push(`Maximum value is ${rule.ruleValue}.`)
                                        }
                                        break
                                }
                            })

                        if (fieldErrors.length > 0) {
                            rowError[fieldName] = fieldErrors
                        }

                        // Collect values for unique field checks
                        if (uniqueFieldValues[fieldName] && cellValue) {
                            if (!uniqueFieldValues[fieldName].has(cellValue)) {
                                uniqueFieldValues[fieldName].set(cellValue, [])
                            }
                            uniqueFieldValues[fieldName].get(cellValue)!.push(rowIndex)
                        }
                    })

                // Add a general error if the row is entirely empty and has mapped fields
                if (
                    isCurrentRowEffectivelyEmpty &&
                    currentColumnMappings.some((m) => m.confirmedField && m.confirmedField !== "ignore")
                ) {
                    const firstMappedField = currentColumnMappings.find((m) => m.confirmedField && m.confirmedField !== "ignore")
                    if (firstMappedField) {
                        const firstFieldName =
                            firstMappedField.confirmedField === "custom"
                                ? firstMappedField.customFieldName!
                                : firstMappedField.confirmedField!
                        if (!rowError[firstFieldName]) {
                            rowError[firstFieldName] = []
                        }
                        if (!rowError[firstFieldName]!.includes("Row cannot be entirely empty.")) {
                            rowError[firstFieldName]!.push("Row cannot be entirely empty.")
                        }
                    }
                }

                if (Object.keys(rowError).length > 0) {
                    newErrors[rowIndex] = rowError
                }
            })

            // 5. Apply Unique Field Validation
            uniqueFieldRules.forEach((rule) => {
                const fieldName = rule.fieldName
                const valuesMap = uniqueFieldValues[fieldName]
                if (valuesMap) {
                    valuesMap.forEach((indices, value) => {
                        if (indices.length > 1) {
                            indices.forEach((rowIndex) => {
                                newDuplicateEntryErrors.add(rowIndex)
                                if (!newErrors[rowIndex]) newErrors[rowIndex] = {}
                                if (!newErrors[rowIndex][fieldName]) {
                                    newErrors[rowIndex][fieldName] = []
                                }
                                // Only add duplicate message if not already present
                                if (!newErrors[rowIndex][fieldName]!.includes(`Duplicate entry for ${fieldName}: "${value}"`)) {
                                    newErrors[rowIndex][fieldName]!.push(`Duplicate entry for ${fieldName}: "${value}"`)
                                }
                            })
                        }
                    })
                }
            })

            // Only update state if errors have actually changed to prevent infinite loops
            if (!deepEqual(errors, newErrors)) {
                setErrors(newErrors)
            }
            if (!setEqual(duplicateEntryErrors, newDuplicateEntryErrors)) {
                setDuplicateEntryErrors(newDuplicateEntryErrors)
            }
        },
        [errors, duplicateEntryErrors], // Dependencies for useCallback
    )

    // Run validation whenever rows or column mappings or custom rules change
    React.useEffect(() => {
        performValidation(rows, memoizedColumnMappings, memoizedCustomValidationRules)
    }, [rows, memoizedColumnMappings, memoizedCustomValidationRules, performValidation])

    const editCell = (originalIndex: number, field: string, value: string) => {
        setRows((prev) => {
            const updated = [...prev]
                ; (updated[originalIndex] as any)[field] = value
            return updated
        })
    }

    const deleteRow = (originalIndex: number) => {
        setRows((prev) => {
            const newRows = prev.filter((_, i) => i !== originalIndex)
            // Adjust current page if the last row on the current page was deleted
            const newTotalPages = Math.ceil(newRows.length / pageSize)
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages)
            } else if (newTotalPages === 0) {
                setCurrentPage(1) // Reset to page 1 if all rows are deleted
            }
            return newRows
        })
        toast.success("Row deleted")
    }

    const addRow = () => {
        const newRow: WizardRow = {}
        // Initialize new row with empty strings for all mapped fields
        columnMappings.forEach((mapping) => {
            if (mapping.confirmedField && mapping.confirmedField !== "ignore") {
                newRow[mapping.confirmedField === "custom" ? mapping.customFieldName! : mapping.confirmedField] = ""
            }
        })
        setRows((prev) => [...prev, newRow])
        // Move to the last page when a new row is added
        setCurrentPage(Math.ceil((rows.length + 1) / pageSize))
    }

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" | null = "asc"
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") {
                direction = "desc"
            } else if (sortConfig.direction === "desc") {
                direction = null // Cycle back to no sort
            } else {
                direction = "asc" // Start with asc if currently no sort
            }
        }
        setSortConfig({ key, direction })
        setCurrentPage(1) // Reset to first page on sort
    }

    const sortedAndFilteredRows = React.useMemo(() => {
        let currentRows = [...rows]

        // Apply search filter
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase()
            currentRows = currentRows.filter((row) =>
                Object.values(row).some((value) => String(value).toLowerCase().includes(lowerCaseSearchTerm)),
            )
        }

        // Apply sorting
        if (sortConfig.key && sortConfig.direction) {
            currentRows.sort((a, b) => {
                const aValue = String(a[sortConfig.key!]).toLowerCase()
                const bValue = String(b[sortConfig.key!]).toLowerCase()

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1
                }
                return 0
            })
        }
        return currentRows
    }, [rows, searchTerm, sortConfig])

    // Pagination logic
    const totalPages = Math.ceil(sortedAndFilteredRows.length / pageSize)
    const paginatedRows = sortedAndFilteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const goToFirstPage = () => setCurrentPage(1)
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))
    const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))
    const goToLastPage = () => setCurrentPage(totalPages)

    // Reset page to 1 if search term changes or total pages decrease significantly
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, totalPages])

    const totalErrors = Object.keys(errors).length
    const validRowsCount = rows.length - totalErrors // This count is for the *original* rows, not filtered/sorted

    const getCellClassName = (originalIndex: number, field: string) => {
        const isEditing = editingCell?.row === originalIndex && editingCell?.field === field
        const hasError = errors[originalIndex]?.[field] && errors[originalIndex][field]!.length > 0
        const isDuplicate = duplicateEntryErrors.has(originalIndex) // Check if the row itself has a duplicate email error

        return `
      relative border bg-background p-0
      ${isEditing ? "border-blue-500 ring-1 ring-blue-500 z-10" : ""}
      ${hasError ? "border-red-500 ring-1 ring-red-500" : ""}
      ${isDuplicate && !hasError ? "border-yellow-500 ring-1 ring-yellow-500" : ""}
    `
    }

    const handleNextClick = () => {
        onNext(rows) // Pass the original, un-filtered/un-sorted rows for final processing
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {validRowsCount} Valid
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        {totalErrors} Errors
                    </Badge>
                    <Badge variant="outline">
                        Showing {sortedAndFilteredRows.length} of {rows.length} rows
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addRow} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Row
                    </Button>
                </div>
            </div>

            {totalErrors > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>There are {totalErrors} errors that need to be resolved before proceeding.</span>
                </div>
            )}

            <div className="mt-4">
                <Input
                    type="text"
                    placeholder="Search rows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="mt-6 overflow-hidden shadow-sm border rounded-lg">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-fixed">
                        <thead className="bg-sidebar">
                            <tr className="[&_th]:p-2 [&_th]:border-b [&_th]:border-r text-muted-foreground font-normal">
                                <th className="w-[50px] text-xs text-center">
                                    #
                                </th>
                                {columnMappings
                                    .filter((m) => m.confirmedField && m.confirmedField !== "ignore")
                                    .map((mapping) => {
                                        const fieldName =
                                            mapping.confirmedField === "custom" ? mapping.customFieldName! : mapping.confirmedField!
                                        return (
                                            <th
                                                key={fieldName}
                                                className="text-left relative min-w-[150px] cursor-pointer"
                                                onClick={() => handleSort(fieldName)}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="capitalize">{fieldName}</span>
                                                    {sortConfig.key === fieldName &&
                                                        (sortConfig.direction === "asc" ? (
                                                            <ArrowUp className="h-4 w-4" />
                                                        ) : sortConfig.direction === "desc" ? (
                                                            <ArrowDown className="h-4 w-4" />
                                                        ) : null)}
                                                </div>
                                            </th>
                                        )
                                    })}
                                <th className="w-[80px] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map((row) => {
                                // Find the original index of the row in the 'rows' array
                                const actualOriginalIndex = rows.indexOf(row)
                                const rowHasErrors = errors[actualOriginalIndex] && Object.keys(errors[actualOriginalIndex]).length > 0
                                return (
                                    <tr key={actualOriginalIndex} className="border-b">
                                        {/* Row Number */}
                                        <td className="p-2 border-r text-xs text-muted-foreground text-center bg-sidebar font-mono sticky left-0 z-10">
                                            {actualOriginalIndex + 1}
                                        </td>
                                        {/* Data Cells */}
                                        {columnMappings
                                            .filter((m) => m.confirmedField && m.confirmedField !== "ignore")
                                            .map((mapping) => {
                                                const fieldName =
                                                    mapping.confirmedField === "custom" ? mapping.customFieldName! : mapping.confirmedField!
                                                const cellErrors = errors[actualOriginalIndex]?.[fieldName] || []
                                                const hasCellError = cellErrors.length > 0

                                                return (
                                                    <td key={fieldName} className={getCellClassName(actualOriginalIndex, fieldName)}>
                                                        <div className="relative h-full w-full">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    {/* Wrap input in a span to prevent children error */}
                                                                    <span className="w-full h-full block text-sm">
                                                                        <input
                                                                            value={row[fieldName] ?? ""}
                                                                            onChange={(e) => editCell(actualOriginalIndex, fieldName, e.target.value)}
                                                                            onFocus={() => setEditingCell({ row: actualOriginalIndex, field: fieldName })}
                                                                            onBlur={() => setEditingCell(null)}
                                                                            className="w-full h-full px-2 py-1 bg-background outline-none border-none focus:ring-0 focus:border-0"
                                                                            placeholder={`Enter ${fieldName}`}
                                                                        />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                {hasCellError && (
                                                                    <TooltipContent className="bg-red-600 text-white">
                                                                        <ul className="list-disc pl-4">
                                                                            {cellErrors.map((msg, i) => (
                                                                                <li key={i}>{msg}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                            {hasCellError && (
                                                                <AlertCircle className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        {/* Actions */}
                                        <td className="p-0 text-center border-l w-[80px]">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteRow(actualOriginalIndex)}
                                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Delete row</TooltipContent>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                )
                            })}

                            {sortedAndFilteredRows.length === 0 && (
                                <tr className="border">
                                    <td colSpan={columnMappings.length + 2} className="p-2 text-center">No record found for "{searchTerm}"</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {sortedAndFilteredRows.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={goToFirstPage} disabled={currentPage === 1}>
                        <ChevronFirst className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToLastPage} disabled={currentPage === totalPages}>
                        <ChevronLast className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="p-6 border-t flex justify-between">
                <Button variant="secondary" onClick={onGoBack}>
                    Go back
                </Button>
                <Button
                    onClick={handleNextClick}
                    disabled={totalErrors > 0} // Disable if there are any errors
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    Next
                </Button>
            </div>
        </>
    )
}

// --- CompleteStep Component ---
interface CompleteStepProps {
    finalRows: WizardRow[] // Now accepts WizardRow[]
    onStartOver: () => void
}

function CompleteStep({ finalRows, onStartOver }: CompleteStepProps) {
    const [isSaving, setIsSaving] = React.useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await saveRows(finalRows)
            toast.success("Data saved successfully!")
        } catch (error) {
            console.error("Failed to save data:", error)
            toast.error("Failed to save data. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <div className="text-center p-8 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Import Ready!</h2>
                <p className="text-gray-600">
                    You are about to import <span className="font-semibold">{finalRows.length}</span> rows.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white">
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Save Data"
                        )}
                    </Button>
                    <Button variant="outline" onClick={onStartOver}>
                        Import another file
                    </Button>
                </div>
            </div>
        </>
    )
}

// --- Main CsvImporter Component ---
export default function CsvImporter() {
    const [currentStep, setCurrentStep] = React.useState<ImportStep>("upload")
    const [file, setFile] = React.useState<File | null>(null)
    const [rawData, setRawData] = React.useState<string[][]>([])
    const [fileName, setFileName] = React.useState<string>("")
    const [headerRowIndex, setHeaderRowIndex] = React.useState<number | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [processedRowsForRepair, setProcessedRowsForRepair] = React.useState<WizardRow[]>([])
    const [mappedColumnsForRepair, setMappedColumnsForRepair] = React.useState<ColumnMapping[]>([])
    const [customValidationRules, setCustomValidationRules] = React.useState<CustomValidationRule[]>([]) // New state for custom rules

    const handleFileSelect = async (uploadedFile: File) => {
        setIsLoading(true)
        setFile(uploadedFile)
        setFileName(uploadedFile.name)
        Papa.parse(uploadedFile, {
            header: false, // Parse as raw data, not with headers yet
            skipEmptyLines: true,
            complete: ({ data, errors: parseErrors }: any) => {
                if (parseErrors.length > 0) {
                    toast.error("Error parsing CSV file. Please check the format.")
                    setIsLoading(false)
                    return
                }
                setRawData(data)
                // Automatically select the first row as header if data exists, matching the image
                if (data.length > 0) {
                    setHeaderRowIndex(0) // Fixed to 0 as per user request
                    setCurrentStep("match") // Transition to match step
                }
                toast.success(`Successfully loaded ${data.length} rows from ${uploadedFile.name}`)
                setIsLoading(false)
            },
            error: () => {
                toast.error("Failed to parse CSV file")
                setIsLoading(false)
            },
        })
    }

    const handleGoBack = () => {
        if (currentStep === "match") {
            setFile(null)
            setRawData([])
            setFileName("")
            setHeaderRowIndex(null)
            setCurrentStep("upload")
        } else if (currentStep === "repair") {
            setCurrentStep("match")
        }
        // Add logic for other steps if needed
    }

    const handleMatchStepNext = (mappedColumns: ColumnMapping[], rules: CustomValidationRule[]) => {
        setMappedColumnsForRepair(mappedColumns) // Store mappings for RepairStep
        setCustomValidationRules(rules) // Store custom rules

        // Transform rawData into WizardRow[] based on mappings for the RepairStep
        const dataRows = headerRowIndex !== null && headerRowIndex !== -1 ? rawData.slice(headerRowIndex + 1) : rawData

        const transformedRows: WizardRow[] = dataRows.map((csvRow) => {
            const newRow: WizardRow = {}
            mappedColumns.forEach((mapping) => {
                const value = csvRow[mapping.csvColumnIndex]
                if (mapping.confirmedField && mapping.confirmedField !== "ignore") {
                    const fieldName = mapping.confirmedField === "custom" ? mapping.customFieldName! : mapping.confirmedField
                    newRow[fieldName] = value
                }
            })
            return newRow
        })

        setProcessedRowsForRepair(transformedRows)
        setCurrentStep("repair")
    }

    const handleRepairStepNext = (finalRows: WizardRow[]) => {
        // Now accepts WizardRow[]
        setProcessedRowsForRepair(finalRows)
        setCurrentStep("complete")
    }

    const handleStartOver = () => {
        setFile(null)
        setRawData([])
        setFileName("")
        setHeaderRowIndex(null)
        setProcessedRowsForRepair([])
        setMappedColumnsForRepair([])
        setCustomValidationRules([]) // Reset custom rules on start over
        setCurrentStep("upload")
    }

    const steps: ImportStep[] = ["upload", "match", "repair", "complete"]
    const currentStepIndex = steps.indexOf(currentStep)

    return (
        <div className="p-4">
            <Card className="w-full shadow-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-6 pb-3">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <span className={index <= currentStepIndex ? "text-primary font-medium" : ""}>
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>
                            {index < steps.length - 1 && <span className="mx-1">{">"}</span>}
                        </React.Fragment>
                    ))}
                </div>
                <CardContent className="space-y-6">
                    {currentStep === "upload" && (
                        <UploadStep
                            onFileSelect={handleFileSelect}
                            isLoading={isLoading}
                            isDragOver={isDragOver}
                            setIsDragOver={setIsDragOver}
                            fileInputRef={fileInputRef}
                        />
                    )}
                    {currentStep === "match" && rawData.length > 0 && (
                        <MatchStep
                            rawData={rawData}
                            fileName={fileName}
                            headerRowIndex={headerRowIndex} // Still passed, but not used for UI interaction
                            onGoBack={handleGoBack}
                            onNext={handleMatchStepNext}
                            initialCustomValidationRules={customValidationRules} // Pass initial rules
                        />
                    )}
                    {currentStep === "repair" && processedRowsForRepair.length > 0 && (
                        <RepairStep
                            initialMappedData={processedRowsForRepair}
                            columnMappings={mappedColumnsForRepair}
                            customValidationRules={customValidationRules} // Pass custom rules to RepairStep
                            onGoBack={handleGoBack}
                            onNext={handleRepairStepNext}
                        />
                    )}
                    {currentStep === "complete" && processedRowsForRepair.length > 0 && (
                        <CompleteStep finalRows={processedRowsForRepair} onStartOver={handleStartOver} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
