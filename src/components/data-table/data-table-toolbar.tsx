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

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { exportTableToExcel } from "@/lib/export-excel"


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
                <ToggleDensity table={table} />

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
                        Export CSV
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                            exportTableToExcel(table, {
                                filename: "audit-log",
                                excludeColumns: ["select"],
                            })
                        }
                    >
                        <Download className="size-4" aria-hidden="true" />
                        Export Excel
                    </Button>
                </div>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}

export function ToggleDensity<TData>({table}:DataTableToolbarProps<TData>) {
  return (
    <ToggleGroup type="single" defaultValue={table.getState().density} variant={'outline'}>
      <ToggleGroupItem value="sm" aria-label="Toggle sm" onClick={()=> table.setDensity("sm")}>sm</ToggleGroupItem>
      <ToggleGroupItem value="md" aria-label="Toggle md" onClick={()=> table.setDensity("md")}>md</ToggleGroupItem>
      <ToggleGroupItem value="lg" aria-label="Toggle lg" onClick={()=> table.setDensity("lg")}>lg</ToggleGroupItem>
    </ToggleGroup>
  )
}
