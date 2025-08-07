import React from "react"
import {
    Trash2,
    Download,
    Plus,
    CheckCircle2,
    Search,
    FilterX,
    Upload,
    RotateCcw,
    ArrowUp,
    X,
    ArrowDown,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { RowData, RowErrors, SortConfig } from "./types"

interface ToolbarProps {
    rows: RowData[]
    filteredRows: RowData[]
    errors: RowErrors
    duplicateEmailIndexes: Set<number>
    isSaving: boolean
    searchQuery: string
    sortConfig: SortConfig
    onAddRow: () => void
    onExport: () => void
    onSave: () => void
    onSearch: (query: string) => void
    onClearFilters: () => void
    onReset: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
    rows,
    filteredRows,
    errors,
    duplicateEmailIndexes,
    isSaving,
    searchQuery,
    sortConfig,
    onAddRow,
    onExport,
    onSave,
    onSearch,
    onClearFilters,
    onReset,
}) => {
    const totalErrors = Object.values(errors).reduce(
        (sum, rowErrs) => sum + Object.values(rowErrs).flat().length,
        0
    )
    const validRows = rows.length - Object.keys(errors).length

    return (
        <div className="space-y-4">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search across all columns..."
                            value={searchQuery}
                            onChange={(e) => onSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onReset} size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                    {(searchQuery || sortConfig.field) && (
                        <Button variant="outline" onClick={onClearFilters} size="sm">
                            <FilterX className="h-4 w-4 mr-1" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || sortConfig.field) && (
                <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Search className="h-3 w-3" />
                            Search: "{searchQuery}"
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => onSearch("")}
                            >
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
                                onClick={() => onClearFilters()}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Stats and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                    <Button variant="outline" onClick={onAddRow} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Row
                    </Button>
                    <Button variant="outline" onClick={onExport} size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export {filteredRows.length > 0 && filteredRows.length < rows.length ? "Filtered" : ""}
                    </Button>
                    <Button
                        onClick={onSave}
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
        </div>
    )
}