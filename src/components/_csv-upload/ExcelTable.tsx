import React from "react"
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    AlertCircle,
    Trash2,
    FilterX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RowData, RowErrors, SelectedField, SortConfig } from "./types"

interface ExcelTableProps {
    fields: SelectedField[];
    rows: RowData[]
    filteredRows: RowData[]
    errors: RowErrors
    duplicateEmailIndexes: Set<number>
    editingCell: { row: number; field: string } | null
    searchQuery: string
    sortConfig: SortConfig
    onEditCell: (originalIndex: number, field: string, value: string) => void
    onSetEditingCell: (cell: { row: number; field: string } | null) => void
    onDeleteRow: (originalIndex: number) => void
    onSort: (field: string) => void
    onClearFilters: () => void
}

export const ExcelTable: React.FC<ExcelTableProps> = ({
    fields,
    rows,
    filteredRows,
    errors,
    duplicateEmailIndexes,
    editingCell,
    searchQuery,
    sortConfig,
    onEditCell,
    onSetEditingCell,
    onDeleteRow,
    onSort,
    onClearFilters
}) => {
    const getSortIcon = (field: string) => {
        if (sortConfig.field !== field) return <ArrowUpDown className="h-3 w-3 text-gray-400" />
        if (sortConfig.direction === "asc") return <ArrowUp className="h-3 w-3 text-blue-600" />
        if (sortConfig.direction === "desc") return <ArrowDown className="h-3 w-3 text-blue-600" />
        return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    }

    const getCellClassName = (originalIndex: number, field: any) => {
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

    const getInputType = (fieldType: string) => {
        switch (fieldType) {
            case 'number': return 'number';
            case 'email': return 'email';
            case 'date': return 'date';
            default: return 'text';
        }
    };

    const highlightSearchText = (text: string, query: string) => {
        if (!query.trim()) return text

        const regex = new RegExp(`(${query})`, "gi")
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200">
                    {part}
                </mark>
            ) : (
                part
            ),
        )
    }

    return (
        <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="w-[50px] p-2 border-r border-gray-300 text-xs font-medium text-gray-600 text-center bg-gray-200 sticky left-0 z-20">
                                #
                            </th>
                            {fields.map((field) => (
                                <th
                                    key={field.name}
                                    className="p-2 border-r border-gray-200 text-left font-semibold text-gray-700 relative min-w-[150px] bg-gray-100"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => onSort(field.name)}
                                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            <span className="capitalize">{field.name}</span>
                                            {getSortIcon(field.name)}
                                        </button>
                                    </div>
                                </th>
                            ))}
                            <th className="w-[80px] p-2 text-center font-semibold text-gray-700 bg-gray-100">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row, displayIndex) => {
                            const originalIndex = rows.findIndex((r) => r === row)
                            return (
                                <tr key={originalIndex} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-2 border-r border-gray-200 text-xs text-gray-500 text-center bg-gray-50 font-mono sticky left-0 z-10">
                                        {displayIndex + 1}
                                    </td>

                                    {fields.map((field) => (
                                        <td key={`${originalIndex}-${field.name}`} className={getCellClassName(originalIndex, field.name)}>
                                            <div className="relative h-full w-full">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-full h-full">
                                                            <input
                                                                type={getInputType(field.type)}
                                                                value={row[field.name] ?? ""}
                                                                onChange={(e) => onEditCell(originalIndex, field.name, e.target.value)}
                                                                onFocus={() => onSetEditingCell({ row: originalIndex, field: field.name })}
                                                                onBlur={() => onSetEditingCell(null)}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                                className="w-full h-full px-2 py-1 bg-transparent outline-none border-none focus:ring-0 focus:border-0"
                                                                placeholder={`Enter ${field.name}`}
                                                                maxLength={
                                                                    field.type === 'number' && field.name === "age"
                                                                        ? 2
                                                                        : field.type === 'number' && field.name === "mobile"
                                                                            ? 10
                                                                            : 40
                                                                }
                                                                max={
                                                                    field.type === 'number' && field.name === "age"
                                                                        ? 30 // max age allowed
                                                                        : field.type === 'number' && field.name === "mobile"
                                                                            ? 9999999999 // max 10-digit number
                                                                            : 9999999999
                                                                }
                                                                min={
                                                                    field.type === 'number' && field.name === "age"
                                                                        ? 20 // min age
                                                                        : field.type === 'number' && field.name === "mobile"
                                                                            ? 1000000000 // min 10-digit number
                                                                            : undefined
                                                                }
                                                            />
                                                            {searchQuery && !editingCell && (
                                                                <div className="absolute inset-0 px-2 py-1 pointer-events-none text-transparent">
                                                                    {highlightSearchText(String(row[field.name] ?? ""), searchQuery)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    {errors[originalIndex]?.[field.name] && (
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            <div className="space-y-1">
                                                                {errors[originalIndex]![field.name]!.map((error, idx) => (
                                                                    <div key={idx} className="text-sm">
                                                                        {error}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>

                                                {errors[originalIndex]?.[field.name] && (
                                                    <div className="absolute top-0.5 right-0.5 pointer-events-none">
                                                        <AlertCircle className="h-3 w-3 text-red-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    ))}

                                    <td className="p-0 text-center border-l border-gray-200 w-[80px]">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDeleteRow(originalIndex)}
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

            {filteredRows.length === 0 && rows.length > 0 && (
                <div className="p-8 text-center text-gray-500 bg-white border-t border-gray-200">
                    <FilterX className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No rows match your current filters</p>
                    <Button variant="outline" onClick={onClearFilters} className="mt-2 bg-transparent" size="sm">
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    )
}