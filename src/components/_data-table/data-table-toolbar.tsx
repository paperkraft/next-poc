"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import DeleteRecordDialog from "./data-table-delete"
import { DataTableSearch } from "./data-table-search"
import { DataTableDensity } from "./data-table-density"
import { DataTableExport } from "./data-table-export"
import { DataTableViewColumn } from "./data-table-view-column"
import { PermissionGuard } from "../PermissionGuard"

const ALLOWED_TOOLBARS = ["export", "density", "columns"] as const;
export type ToolbarOptions = (typeof ALLOWED_TOOLBARS)[number];
interface DataTableToolbarProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>;
    deleteRecord?: (id: string | string[]) => Promise<void>;
    moduleId?: string;
    toolbar?: ToolbarOptions[]
}

export function DataTableToolbar<TData>({ table, deleteRecord, moduleId, toolbar = [] }: DataTableToolbarProps<TData>) {

    const isSelected = table.getFilteredSelectedRowModel()?.rows?.length > 0;

    return (
        <div className={cn("flex flex-wrap md:flex-nowrap w-full items-center justify-between gap-2 overflow-auto border-b p-3")}>
            <DataTableSearch table={table} />
            <div className="hidden md:flex items-center gap-2">
                {isSelected && moduleId &&
                    <PermissionGuard action="DELETE" moduleId={moduleId}>
                        <DeleteRecordDialog table={table} deleteRecord={deleteRecord} />
                    </PermissionGuard>
                }
                {toolbar.includes("export") && <DataTableExport table={table} />}
                {toolbar.includes("density") && <DataTableDensity table={table} />}
                {toolbar.includes("columns") && <DataTableViewColumn table={table} />}
            </div>
        </div>
    )
}