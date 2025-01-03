"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Download, Table2, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-option"
import { Button } from "../ui/button"
import { exportTableToCSV } from "@/lib/export"
import DeleteRecordDialog from "./data-table-delete"


interface DataTableToolbarProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {

    return (
        <div className={cn("flex w-full items-center justify-between gap-2 overflow-auto p-1")}>
            <div className="relative">
                <Input
                    placeholder="Search"
                    className="max-w-md"
                    value={(table.getState().globalFilter) ?? ""}
                    onChange={e => table.setGlobalFilter(String(e.target.value))}
                />
                {
                    table.getState().globalFilter?.length > 0 &&
                    <X onClick={() => table.resetGlobalFilter()}
                        className={cn("opacity-50 hover:opacity-100 size-7 absolute top-[50%] right-1 -translate-y-1/2 px-1.5 font-normal cursor-pointer")}
                    />
                }
            </div>

            <div className="flex items-center gap-2">
                {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                    <DeleteRecordDialog table={table} />
                ) : null}
                <div>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                            exportTableToCSV(table, {
                                filename: "audit-log",
                                excludeColumns: ["select"],
                            })
                        }
                    >
                        <Download className="size-4" aria-hidden="true" />
                        Export
                    </Button>
                </div>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}