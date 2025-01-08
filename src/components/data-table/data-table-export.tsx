import { Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button";
import { ChevronsUpDownIcon, DownloadIcon } from "lucide-react";
import { exportTableToCSV } from "@/lib/export";
import { exportTableToExcel } from "@/lib/export-excel";

interface DataTableExportProps<TData> {
    table: Table<TData>
}

function getHiddenColumns<TData>(allColumns: (keyof TData)[], visibleColumns: (keyof TData)[]) {
    const hiddenColumns = allColumns.filter(column => !visibleColumns.includes(column));
    hiddenColumns.unshift("select" as keyof TData);
    return hiddenColumns
}

export function DataTableExport<TData>({ table }: DataTableExportProps<TData>) {

    const allColumns = table.getAllLeafColumns().map((column) => column.id as keyof TData);
    const visibleColumns = table.getVisibleFlatColumns().map((column) => column.id as keyof TData);
    const excludeColumns = getHiddenColumns(allColumns, visibleColumns)

    const exportOptions: { label: string, onClick: () => void }[] = [
        {
            label: "Download as CSV",
            onClick: () => exportTableToCSV(table, { filename: "audit-log", excludeColumns }),
        }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    <DownloadIcon className="size-4" />
                    Export
                    <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    {exportOptions.map(({ label, onClick }, index) => (
                        <DropdownMenuItem key={index} onClick={onClick}>
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}