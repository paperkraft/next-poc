"use client";

import { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    PaginationState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DensityFeature, DensityState } from "@/utils/tanstack-utils";
import { cn } from "@/lib/utils";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

    // const ref = useRef<HTMLInputElement | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
    const [density, setDensity] = useState<DensityState>("md");

    const table = useReactTable({
        // debugTable: true,
        data,
        columns,
        state: {
            sorting,
            pagination,
            globalFilter,
            rowSelection,
            density,
        },

        enableRowSelection: true,
        autoResetPageIndex: false,
        _features: [DensityFeature],

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onDensityChange: setDensity,
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}
                                        className={cn( "transition-[padding] duration-[0.2s]",{
                                            "p-1": density === "sm",
                                            "p-2": density === "md",
                                            "p-3": density === "lg",
                                        })}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <Button size="icon" variant="ghost" onClick={header.column.getToggleSortingHandler()}>
                                                        {header.column.getIsSorted() ? (
                                                            header.column.getIsSorted() === "desc" ? (
                                                                <ArrowDownWideNarrow className="size-4" />
                                                            ) : (
                                                                <ArrowUpNarrowWide className="size-4" />
                                                            )
                                                        ) : (
                                                            <ArrowDownUp className="size-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}
                                            className={cn( "transition-[padding] duration-[0.2s]",{
                                                "p-1": density === "sm",
                                                "p-2": density === "md",
                                                "p-3": density === "lg",
                                            })}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <DataTablePagination table={table} />
            </div>
        </div>
    );
}