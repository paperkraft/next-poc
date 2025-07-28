'use client'

import React from "react"
import { toast } from "sonner"
import Papa from "papaparse"
import { FileDropzone } from "./FileDropzone"
import { Toolbar } from "./Toolbar"
import { ExcelTable } from "./ExcelTable"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileSpreadsheet } from "lucide-react"
import {
    validateAllRows,
    exportToCsv,
    saveRows,
    generateSchema
} from "./utils"
import { RowData, RowErrors, SelectedField, SortConfig, SortDirection } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldSelectionModal } from "./FieldSelectionModal"

export const CsvUpload: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [csvHeaders, setCsvHeaders] = React.useState<string[]>([]);
    const [selectedFields, setSelectedFields] = React.useState<SelectedField[]>([]);
    const [parsedData, setParsedData] = React.useState<any[]>([]);

    const [rows, setRows] = React.useState<RowData[]>([])
    const [errors, setErrors] = React.useState<RowErrors>({})
    const [duplicateEmailIndexes, setDuplicateEmailIndexes] = React.useState<Set<number>>(new Set())
    const [editingCell, setEditingCell] = React.useState<{ row: number; field: string } | null>(null)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [sortConfig, setSortConfig] = React.useState<SortConfig>({ field: null, direction: null })

    const schema = React.useMemo(() => {
        return generateSchema(selectedFields);
    }, [selectedFields]);

    // Filter and sort data whenever rows, searchQuery, or sortConfig changes
    const filteredRows = React.useMemo(() => {
        let result = [...rows];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(row =>
                selectedFields.some(field =>
                    String(row[field.name]).toLowerCase().includes(query)
                )
            );
        }

        // Apply sorting
        if (sortConfig.field && sortConfig.direction) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.field!];
                const bValue = b[sortConfig.field!];

                if (aValue === bValue) return 0;
                if (sortConfig.direction === 'asc') {
                    return aValue < bValue ? -1 : 1;
                } else {
                    return aValue > bValue ? -1 : 1;
                }
            });
        }

        return result;
    }, [rows, searchQuery, sortConfig, selectedFields]);

    const handleSort = (field: string) => {
        setSortConfig((prev) => {
            if (prev.field === field) {
                const newDirection: SortDirection =
                    prev.direction === "asc" ? "desc" :
                        prev.direction === "desc" ? null : "asc"
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

    const handleFile = async (file: File) => {
        setIsLoading(true)
        Papa.parse<RowData>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (!results.meta.fields || results.meta.fields.length === 0) {
                    toast.error('CSV file has no headers');
                    return;
                }
                setCsvHeaders(results.meta.fields);
                setParsedData(results.data);
                setModalOpen(true);
                setIsLoading(false);
            },
            error: () => {
                toast.error("Failed to parse CSV file")
                setIsLoading(false)
            },
        })
    }

    const resetAll = () => {
        setRows([])
        setErrors({})
        setSelectedFields([])
        setDuplicateEmailIndexes(new Set())
        setSearchQuery("")
        setSortConfig({ field: null, direction: null })
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const editCell = (originalIndex: number, field: string, value: string) => {
        setRows((prev) => {
            const updated = [...prev];
            (updated[originalIndex] as any)[field] = value
            // Revalidate all rows whenever any cell changes
            const newRows = [...updated]
            const { errors, duplicateIndexes } = validateAllRows(newRows, schema)
            setErrors(errors)
            setDuplicateEmailIndexes(duplicateIndexes)
            return updated
        })
    }

    const deleteRow = (originalIndex: number) => {
        setRows((prev) => {
            const updated = prev.filter((_, i) => i !== originalIndex)
            const { errors, duplicateIndexes } = validateAllRows(updated, schema)
            setErrors(errors)
            setDuplicateEmailIndexes(duplicateIndexes)
            return updated
        })
        toast.success("Row deleted")
    }

    const addRow = () => {
        const newRow = { name: "", email: "", age: 0 }
        setRows((prev) => {
            const updated = [...prev, newRow]
            const { errors } = validateAllRows(updated, schema)
            setErrors(errors)
            return updated
        })
    }

    const handleSave = async () => {
        if (duplicateEmailIndexes.size > 0) {
            toast.error("Please resolve duplicate emails before saving")
            return
        }

        if (Object.keys(errors).length > 0) {
            toast.error("Please fix all validation errors before saving")
            return
        }

        setIsSaving(true)
        try {
            await saveRows(rows, schema)
            toast.success("Data saved successfully!")
        } catch {
            toast.error("Failed to save data")
        } finally {
            setIsSaving(false)
        }
    }

    const totalErrors = Object.values(errors).reduce(
        (sum, rowErrs) => sum + Object.values(rowErrs).flat().length,
        0
    )

    const handleFieldSelection = (fields: SelectedField[]) => {
        setSelectedFields(fields);

        // Filter the parsed data to only include selected fields
        const filteredData = parsedData.map(row => {
            const filteredRow: any = {};
            fields.forEach(field => {
                filteredRow[field.name] = row[field.name];
            });
            return filteredRow;
        });

        setRows(filteredData);
        setModalOpen(false);

        // Perform initial validation
        const { errors } = validateAllRows(filteredData, schema);
        setErrors(errors);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans text-sm">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Excel-like CSV Editor
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <FieldSelectionModal
                        open={modalOpen}
                        csvHeaders={csvHeaders}
                        onConfirm={handleFieldSelection}
                        onCancel={() => setModalOpen(false)}
                    />

                    {rows.length === 0 ? (
                        <FileDropzone
                            isLoading={isLoading}
                            onDrop={(e) => {
                                e.preventDefault()
                                setIsDragOver(false)
                                const file = e.dataTransfer.files[0]
                                if (file && file.type === "text/csv") {
                                    handleFile(file)
                                } else {
                                    toast.error("Please upload a CSV file")
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault()
                                setIsDragOver(true)
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault()
                                setIsDragOver(false)
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            isDragOver={isDragOver}
                            fileInputRef={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFile(file)
                            }}
                        />
                    ) : (
                        <>
                            <Toolbar
                                rows={rows}
                                filteredRows={filteredRows}
                                errors={errors}
                                duplicateEmailIndexes={duplicateEmailIndexes}
                                isSaving={isSaving}
                                searchQuery={searchQuery}
                                sortConfig={sortConfig}
                                onAddRow={addRow}
                                onExport={() => exportToCsv(filteredRows.length > 0 ? filteredRows : rows)}
                                onSave={handleSave}
                                onSearch={setSearchQuery}
                                onClearFilters={clearAllFilters}
                                onReset={resetAll}
                            />

                            {totalErrors > 0 && (
                                <Alert className="mt-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Please fix {totalErrors} validation error(s) before saving.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <ExcelTable
                                fields={selectedFields}
                                rows={rows}
                                filteredRows={filteredRows}
                                errors={errors}
                                duplicateEmailIndexes={duplicateEmailIndexes}
                                editingCell={editingCell}
                                searchQuery={searchQuery}
                                sortConfig={sortConfig}
                                onEditCell={editCell}
                                onSetEditingCell={setEditingCell}
                                onDeleteRow={deleteRow}
                                onSort={handleSort}
                                onClearFilters={clearAllFilters}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}