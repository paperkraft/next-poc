"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import DeleteRecordDialog from "./data-table-delete"
import { DataTableSearch } from "./data-table-search"
import { DataTableDensity } from "./data-table-density"
import { DataTableExport } from "./data-table-export"
import { DataTableViewColumn } from "./data-table-view-column"


interface DataTableToolbarProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {

    const isSelected = table.getFilteredSelectedRowModel()?.rows?.length > 0;

    return (
        <div className={cn("flex w-full items-center justify-between gap-2 overflow-auto p-1")}>
            <DataTableSearch table={table} />
            <div className="flex items-center gap-2">
                {isSelected && <DeleteRecordDialog table={table} />}
                <DataTableExport table={table} />
                <DataTableDensity table={table} />
                <DataTableViewColumn table={table} />
            </div>
        </div>
    )
}