import { type Table } from "@tanstack/react-table"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

/**
 * Export the table data to an Excel file.
 * @param table - The table to export.
 * @param opts - Options to customize the export.
 */
export function exportTableToExcel<TData>(
    table: Table<TData>,
    opts: {
        filename?: string
        excludeColumns?: (keyof TData | "select")[]
        onlySelected?: boolean
    } = {}
): void {
    const { filename = "table", excludeColumns = [], onlySelected = false } = opts

    // Retrieve headers (column names)
    const headers = table
        .getAllLeafColumns()
        .map((column) => column.id)
        .filter((id) => !excludeColumns.includes(id as any))

    // Build the rows (data for the Excel file)
    const rows = (
        onlySelected
            ? table.getFilteredSelectedRowModel().rows
            : table.getRowModel().rows
    ).map((row) => {
        return headers.map((header) => {
            const cellValue = row.getValue(header)
            // Return the cell value, converting strings and handling commas, etc.
            return typeof cellValue === "string"
                ? cellValue.replace(/"/g, '"') // Escape quotes
                : cellValue
        })
    });

    // const headerTitle = headers.map((head)=> toSentenceCase(head))

    // Add the headers as the first row
    const worksheetData = [headers, ...rows]

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

    // Generate the Excel file and trigger the download
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    })

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    saveAs(blob, `${filename}.xlsx`)
}