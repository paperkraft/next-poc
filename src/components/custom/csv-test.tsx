"use client"

import Papa from "papaparse"
import React from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
    Trash2,
    Upload,
    Download,
    Plus,
    AlertCircle,
    CheckCircle2,
    FileSpreadsheet,
    Loader2,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    X,
    FilterX,
} from "lucide-react"

export const RowSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name required")
        .regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
    email: z.string().email("Invalid email"),
    age: z.coerce.number().int().positive("Age must be ≥1"),
})

export type Row = z.infer<typeof RowSchema>
type RowErrors = Record<number, Partial<Record<keyof Row, string[]>>>

type SortDirection = "asc" | "desc" | null
type SortConfig = {
    field: keyof Row | null
    direction: SortDirection
}

export async function saveRows(rows: Row[]) {
    const parsed = RowSchema.array().safeParse(rows)
    if (!parsed.success) throw new Error("Server-side validation failed")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("✔️ rows accepted:", parsed.data.length)
    console.log("✔️ data:", parsed.data)
}

export default function CsvUpload() {
    const [rows, setRows] = React.useState<Row[]>([])
    const [filteredRows, setFilteredRows] = React.useState<Row[]>([])
    const [errors, setErrors] = React.useState<RowErrors>({})
    const [duplicateEmailIndexes, setDuplicateEmailIndexes] = React.useState<Set<number>>(new Set())
    const [editingCell, setEditingCell] = React.useState<{ row: number; field: keyof Row } | null>(null)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const [searchQuery, setSearchQuery] = React.useState("")
    const [sortConfig, setSortConfig] = React.useState<SortConfig>({ field: null, direction: null })

    // Validate a single row
    const validateRow = (row: Row, index: number) => {
        const result = RowSchema.safeParse(row)
        const fieldErrors: Partial<Record<keyof Row, string[]>> = {}

        if (!result.success) {
            for (const err of result.error.errors) {
                const path = err.path[0] as keyof Row
                fieldErrors[path] = fieldErrors[path] || []
                fieldErrors[path]!.push(err.message)
            }
        }

        // Check for duplicate emails
        if (row.email) {
            const duplicateError = checkDuplicateEmail(row.email, index)
            if (duplicateError) {
                fieldErrors.email = fieldErrors.email || []
                fieldErrors.email!.push(duplicateError)
            }
        }

        return fieldErrors
    }

    // Check for duplicate emails across all rows
    const checkDuplicateEmail = (email: string, index: number): string | null => {
        const duplicate = rows.find((row, idx) => row.email === email && idx !== index)
        return duplicate ? "Email already exists" : null
    }

    // Validate all rows and update error state
    const validateAllRows = (rowsToValidate: Row[]) => {
        const newErrors: RowErrors = {}
        const duplicateIndexes = new Set<number>()

        // First pass to find all duplicate emails
        const emailMap = new Map<string, number[]>()
        rowsToValidate.forEach((row, index) => {
            if (row.email) {
                const normalizedEmail = row.email.toLowerCase().trim()
                if (!emailMap.has(normalizedEmail)) {
                    emailMap.set(normalizedEmail, [])
                }
                emailMap.get(normalizedEmail)!.push(index)
            }
        })

        // Mark duplicates
        emailMap.forEach((indexes) => {
            if (indexes.length > 1) {
                indexes.forEach(index => duplicateIndexes.add(index))
            }
        })

        // Validate each row
        rowsToValidate.forEach((row, index) => {
            const rowErrors = validateRow(row, index)
            if (Object.keys(rowErrors).length > 0) {
                newErrors[index] = rowErrors
            }
        })

        setErrors(newErrors)
        setDuplicateEmailIndexes(duplicateIndexes)
    }

    const checkForDuplicateEmails = (rows: Row[]): Set<number> => {
        const seenEmails: Map<string, Set<number>> = new Map()
        const duplicateIndexes = new Set<number>()

        rows.forEach((row, idx) => {
            const email = row.email.trim().toLowerCase()
            if (email && seenEmails.has(email)) {
                seenEmails.get(email)?.add(idx)
                duplicateIndexes.add(idx)
            } else if (email) {
                seenEmails.set(email, new Set([idx]))
            }
        })

        seenEmails.forEach((indexes) => {
            if (indexes.size > 1) {
                indexes.forEach((idx) => duplicateIndexes.add(idx))
            }
        })

        return duplicateIndexes
    }

    const sortData = (data: Row[], config: SortConfig): Row[] => {
        if (!config.field || !config.direction) return data

        return [...data].sort((a, b) => {
            const aValue = a[config.field!]
            const bValue = b[config.field!]

            let comparison = 0
            if (config.field === "age") {
                comparison = Number(aValue) - Number(bValue)
            } else {
                comparison = String(aValue).localeCompare(String(bValue))
            }

            return config.direction === "asc" ? comparison : -comparison
        })
    }

    const filterData = (data: Row[], query: string): Row[] => {
        let filtered = data

        if (query.trim()) {
            filtered = filtered.filter((row) =>
                Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase())),
            )
        }

        return filtered
    }

    React.useEffect(() => {
        let result = filterData(rows, searchQuery)
        result = sortData(result, sortConfig)
        setFilteredRows(result)
    }, [rows, searchQuery, sortConfig])

    const handleSort = (field: keyof Row) => {
        setSortConfig((prev) => {
            if (prev.field === field) {
                const newDirection: SortDirection = prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc"
                return { field: newDirection ? field : null, direction: newDirection }
            } else {
                return { field, direction: "asc" }
            }
        })
    }

    const clearAllFilters = () => {
        setSearchQuery("")
        setSortConfig({ field: null, direction: null })
    }

    const validateAndProcessData = (data: any[]) => {
        const fieldErrors: RowErrors = {}

        data.forEach((row: any, index: number) => {
            const result = RowSchema.safeParse(row)
            if (!result.success) {
                const rowErr: Partial<Record<keyof Row, string[]>> = {}
                for (const err of result.error.errors) {
                    const key = err.path[0] as keyof Row
                    if (!rowErr[key]) rowErr[key] = []
                    rowErr[key]!.push(err.message)
                }
                fieldErrors[index] = rowErr
            }
        })

        const duplicateIndexes = checkForDuplicateEmails(data)

        duplicateIndexes.forEach((index) => {
            if (!fieldErrors[index]) fieldErrors[index] = {}
            if (!fieldErrors[index]!.email) fieldErrors[index]!.email = []
            fieldErrors[index]!.email!.push("Duplicate email")
        })

        setRows(data)
        setErrors(fieldErrors)
        setDuplicateEmailIndexes(duplicateIndexes)

        if (duplicateIndexes.size > 0) {
            toast.error(`Found ${duplicateIndexes.size} duplicate email(s). Please resolve them before saving.`)
        }
    }

    const handleFile = async (file: File) => {
        setIsLoading(true)

        Papa.parse<Row>(file, {
            header: true,
            skipEmptyLines: true,
            complete: ({ data, errors: parseErrors }: any) => {
                if (parseErrors.length > 0) {
                    toast.error("Error parsing CSV file. Please check the format.")
                    setIsLoading(false)
                    return
                }

                validateAndProcessData(data)
                toast.success(`Successfully loaded ${data.length} rows`)
                setIsLoading(false)
            },
            error: () => {
                toast.error("Failed to parse CSV file")
                setIsLoading(false)
            },
        })
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type === "text/csv") {
            handleFile(file)
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

    const editCell = (originalIndex: number, field: keyof Row, value: string) => {
        setRows((prev) => {
            const updated = [...prev]
                ; (updated[originalIndex] as any)[field] = value

            // Revalidate all rows whenever any cell changes
            const newRows = [...updated]
            validateAllRows(newRows)

            return updated
        })
    }

    const deleteRow = (originalIndex: number) => {
        setRows((prev) => {
            const newRows = prev.filter((_, i) => i !== originalIndex)
            validateAllRows(newRows)
            return newRows
        })
        toast.success("Row deleted")
    }

    const addRow = () => {
        const newRow: Row = { name: "", email: "", age: 0 }
        setRows((prev) => {
            const newRows = [...prev, newRow]
            validateAllRows(newRows)
            return newRows
        })
    }

    const save = async () => {
        const duplicateIndexes = checkForDuplicateEmails(rows)
        if (duplicateIndexes.size > 0) {
            toast.error("Please resolve duplicate emails before saving")
            return
        }

        if (Object.keys(errors).length > 0) {
            toast.error("Please fix all validation errors before saving")
            return
        }

        setIsSaving(true)
        try {
            await saveRows(rows)
            toast.success("Data saved successfully!")
        } catch {
            toast.error("Failed to save data")
        } finally {
            setIsSaving(false)
        }
    }

    const exportCSV = () => {
        const dataToExport = filteredRows.length > 0 ? filteredRows : rows
        const csv = Papa.unparse(dataToExport)
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `data_${+new Date()}.csv`)
        link.click()
        toast.success(`CSV exported with ${dataToExport.length} rows`)
    }

    const totalErrors = Object.values(errors).reduce((sum, rowErrs) => sum + Object.values(rowErrs).flat().length, 0)
    const validRows = rows.length - Object.keys(errors).length

    const getCellClassName = (originalIndex: number, field: keyof Row) => {
        const hasError = errors[originalIndex]?.[field]
        const isDuplicate = duplicateEmailIndexes.has(originalIndex) && field === "email"
        const isEditing = editingCell?.row === originalIndex && editingCell?.field === field

        return `
      relative border border-gray-200 bg-white p-0
      ${hasError ? "border-red-300 bg-red-50" : ""}
      ${isDuplicate && !hasError ? "border-yellow-300 bg-yellow-50" : ""}
      ${isEditing ? "border-blue-500 ring-1 ring-blue-500 z-10" : ""}
    `
    }

    const getSortIcon = (field: keyof Row) => {
        if (sortConfig.field !== field) {
            return <ArrowUpDown className="h-3 w-3 text-gray-400" />
        }
        if (sortConfig.direction === "asc") {
            return <ArrowUp className="h-3 w-3 text-blue-600" />
        }
        if (sortConfig.direction === "desc") {
            return <ArrowDown className="h-3 w-3 text-blue-600" />
        }
        return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    }

    const highlightSearchText = (text: string, query: string) => {
        if (!query.trim()) return text

        const regex = new RegExp(`(${query})`, "gi")
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-0.5 rounded">
                    {part}
                </mark>
            ) : (
                part
            ),
        )
    }

    return (
        <TooltipProvider>
            <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans text-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            CSV Data Manager
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* File Upload Area - Conditionally rendered */}
                        {rows.length === 0 && (
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
                                        <p className="text-sm text-gray-500">Supports CSV files with Name, Email, and Age columns</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Search Controls */}
                        {rows.length > 0 && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search across all columns..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {(searchQuery || sortConfig.field) && (
                                        <Button variant="outline" onClick={clearAllFilters} size="sm">
                                            <FilterX className="h-4 w-4 mr-1" />
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Active Filters Display */}
                        {(searchQuery || sortConfig.field) && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {searchQuery && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Search className="h-3 w-3" />
                                        Search: "{searchQuery}"
                                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setSearchQuery("")}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}
                                {sortConfig.field && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        {sortConfig.direction === "asc" ? (
                                            <ArrowUp className="h-3 w-3" />
                                        ) : (
                                            <ArrowDown className="h-3 w-3" />
                                        )}
                                        Sort: {sortConfig.field} ({sortConfig.direction})
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => setSortConfig({ field: null, direction: null })}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Stats and Actions */}
                        {rows.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        {validRows} Valid
                                    </Badge>
                                    {totalErrors > 0 && (
                                        <Badge variant="destructive" className="flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {totalErrors} Errors
                                        </Badge>
                                    )}
                                    {duplicateEmailIndexes.size > 0 && (
                                        <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                                            <AlertCircle className="h-3 w-3" />
                                            {duplicateEmailIndexes.size} Duplicates
                                        </Badge>
                                    )}
                                    <Badge variant="outline">
                                        Showing {filteredRows.length} of {rows.length} rows
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={addRow} size="sm">
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Row
                                    </Button>
                                    <Button variant="outline" onClick={exportCSV} size="sm">
                                        <Download className="h-4 w-4 mr-1" />
                                        Export {filteredRows.length > 0 && filteredRows.length < rows.length ? "Filtered" : ""}
                                    </Button>
                                    <Button
                                        onClick={save}
                                        disabled={totalErrors > 0 || isSaving}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                        )}
                                        Save Data
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Error Summary */}
                        {totalErrors > 0 && (
                            <Alert className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Please fix {totalErrors} validation error(s) before saving. Hover over cells with errors to see
                                    details.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Excel-like Table */}
                        {rows.length > 0 && (
                            <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                <div className="overflow-x-auto max-h-[600px]">
                                    {" "}
                                    {/* Added max-h for vertical scroll */}
                                    <table className="w-full border-collapse table-fixed">
                                        <thead>
                                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                                <th className="w-[50px] p-2 border-r border-gray-300 text-xs font-medium text-gray-600 text-center bg-gray-200 sticky left-0 z-20">
                                                    #
                                                </th>
                                                {(["name", "email", "age"] as const).map((field) => (
                                                    <th
                                                        key={field}
                                                        className="p-2 border-r border-gray-200 text-left font-semibold text-gray-700 relative
                            min-w-[150px] bg-gray-100
                            "
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <button
                                                                onClick={() => handleSort(field)}
                                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                                            >
                                                                <span className="capitalize">{field}</span>
                                                                {getSortIcon(field)}
                                                            </button>
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="w-[80px] p-2 text-center font-semibold text-gray-700 bg-gray-100">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRows.map((row, displayIndex) => {
                                                const originalIndex = rows.findIndex((r) => r === row)
                                                return (
                                                    <tr key={originalIndex} className="border-b border-gray-200">
                                                        {/* Row Number */}
                                                        <td className="p-2 border-r border-gray-200 text-xs text-gray-500 text-center bg-gray-50 font-mono sticky left-0 z-10">
                                                            {displayIndex + 1}
                                                        </td>

                                                        {/* Data Cells */}
                                                        {(["name", "email", "age"] as const).map((field) => (
                                                            <td key={field} className={getCellClassName(originalIndex, field)}>
                                                                <div className="relative h-full w-full">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="w-full h-full">
                                                                                <input
                                                                                    value={row[field] ?? ""}
                                                                                    onChange={(e) => editCell(originalIndex, field, e.target.value)}
                                                                                    onFocus={() => setEditingCell({ row: originalIndex, field })}
                                                                                    onBlur={() => setEditingCell(null)}
                                                                                    className="w-full h-full px-2 py-1 bg-transparent outline-none border-none focus:ring-0 focus:border-0"
                                                                                    placeholder={
                                                                                        field === "name"
                                                                                            ? "Enter name"
                                                                                            : field === "email"
                                                                                                ? "Enter email"
                                                                                                : "Enter age"
                                                                                    }
                                                                                />
                                                                                {/* Search highlighting overlay */}
                                                                                {searchQuery && !editingCell && (
                                                                                    <div className="absolute inset-0 px-2 py-1 pointer-events-none text-transparent">
                                                                                        {highlightSearchText(String(row[field] ?? ""), searchQuery)}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        {errors[originalIndex]?.[field] && (
                                                                            <TooltipContent side="top" className="max-w-xs">
                                                                                <div className="space-y-1">
                                                                                    {errors[originalIndex]![field]!.map((error, idx) => (
                                                                                        <div key={idx} className="text-sm">
                                                                                            {error}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </TooltipContent>
                                                                        )}
                                                                    </Tooltip>

                                                                    {/* Error Indicator */}
                                                                    {errors[originalIndex]?.[field] && (
                                                                        <div className="absolute top-0.5 right-0.5 pointer-events-none">
                                                                            <AlertCircle className="h-3 w-3 text-red-500" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        ))}

                                                        {/* Actions */}
                                                        <td className="p-0 text-center border-l border-gray-200 w-[80px]">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => deleteRow(originalIndex)}
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
                                        </tbody>
                                    </table>
                                </div>

                                {/* No results message */}
                                {filteredRows.length === 0 && rows.length > 0 && (
                                    <div className="p-8 text-center text-gray-500 bg-white border-t border-gray-200">
                                        <FilterX className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p>No rows match your current filters</p>
                                        <Button variant="outline" onClick={clearAllFilters} className="mt-2 bg-transparent" size="sm">
                                            Clear all filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}