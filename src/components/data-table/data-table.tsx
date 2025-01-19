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
import { DataTableToolbar, ToolbarOptions } from "./data-table-toolbar";
import { DensityFeature, DensityState } from "@/utils/tanstack-utils";
import { cn } from "@/lib/utils";
import { ExpandedState } from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    getRowCanExpand?: (row: Row<TData>) => boolean;
    renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
    isLoading?: boolean;
    deleteRecord?: (id: string | string[]) => Promise<void>;
    moduleId?: string;
    toolbar?: ToolbarOptions[];
}

interface GlobalFilterState {
    filter: string;
    value: any;
}

export function DataTable<TData, TValue>({ columns, data, toolbar, pageSize, getRowCanExpand, renderSubComponent, isLoading = false, deleteRecord, moduleId }: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<GlobalFilterState | undefined>();
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: pageSize ?? data.length });
    const [density, setDensity] = useState<DensityState>("sm");

    const [expanded, setExpanded] = React.useState<ExpandedState>({})

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
            expanded,
        },

        enableRowSelection: true,
        autoResetPageIndex: false,
        _features: [DensityFeature],

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: pageSize ? getPaginationRowModel() : undefined,
        getExpandedRowModel: getExpandedRowModel(),

        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onDensityChange: setDensity,
        onExpandedChange: setExpanded,
    });

    return (
        <div className="rounded-md border">
            <DataTableToolbar table={table} deleteRecord={deleteRecord} moduleId={moduleId} toolbar={toolbar} />
            {isLoading ? (
                <div className="flex items-center justify-center h-64">Loading...</div>
            ) : (
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}
                                        className={cn("transition-[padding]", {
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
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}
                                        className={cn("group", {
                                            "h-9": density === "sm",
                                            "h-11": density === "md",
                                            "h-[3.25rem]": density === "lg",
                                        })}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}
                                                className={cn("transition-[padding]", {
                                                    "p-1": density === "sm",
                                                    "p-2": density === "md",
                                                    "p-3": density === "lg",
                                                })}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (renderSubComponent && renderSubComponent({ row }))}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Add empty rows to fill space if on the last page */}
                        {table.getPageCount() > 1 &&
                            Array.from({ length: pagination.pageSize - table.getRowModel().rows.length }).map((_, index) => (
                                <TableRow key={`empty-${index}`} className={cn("invisible border-transparent", {
                                    "h-9": density === "sm",
                                    "h-11": density === "md",
                                    "h-[3.25rem]": density === "lg",
                                })}>
                                    <TableCell
                                        colSpan={columns.length}
                                        className={cn("transition-[padding]", {
                                            "p-1": density === "sm",
                                            "p-2": density === "md",
                                            "p-3": density === "lg",
                                        })}
                                    >
                                        &nbsp;
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            )}
            {pageSize && <DataTablePagination table={table} />}
        </div>
    );
}