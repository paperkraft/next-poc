"use client";

import React, { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    PaginationState,
    Row,
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
    getRowCanExpand?: (row: Row<TData>) => boolean;
    renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
}

export function DataTable<TData, TValue>({ columns, data, getRowCanExpand, renderSubComponent }: DataTableProps<TData, TValue>) {

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
        getRowCanExpand,
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
        getExpandedRowModel: getExpandedRowModel(),

        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onDensityChange: setDensity,
    });

    return (
        <div className="rounded-md border">
            <DataTableToolbar table={table} />
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}
                                    className={cn("transition-[padding] duration-[0.2s]", {
                                        "p-1": density === "sm",
                                        "p-2": density === "md",
                                        "p-3": density === "lg",
                                    })}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : (header.column.getCanSort()
                                            ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="flex items-center gap-2 p-0 hover:bg-transparent"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                                            )
                                            : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}
                                            className={cn("transition-[padding] duration-[0.2s]", {
                                                "p-1": density === "sm",
                                                "p-2": density === "md",
                                                "p-3": density === "lg",
                                            })}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {row.getIsExpanded() && ( renderSubComponent && renderSubComponent({ row }))}
                            </React.Fragment>
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
    );
}