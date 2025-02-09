"use client";

import React, { useEffect, useState } from "react";
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
    ExpandedState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar, ToolbarOptions } from "./data-table-toolbar";
import { DensityFeature, DensityState } from "@/utils/tanstack-utils";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    getRowCanExpand?: (row: Row<TData>) => boolean;
    isLoading?: boolean;
    deleteRecord?: (id: string | string[]) => Promise<void>;
    moduleId?: string;
    toolbar?: ToolbarOptions[];
}

interface GlobalFilterState {
    filter: string;
    value: any;
}

export function DataTable<TData extends { subModules?: TData[] }, TValue>({ columns, data, toolbar, pageSize, getRowCanExpand, isLoading = false, deleteRecord, moduleId }: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<GlobalFilterState | undefined>();
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: pageSize ?? data?.length });
    const [density, setDensity] = useState<DensityState>("sm");
    const [expanded, setExpanded] = React.useState<ExpandedState>({});

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
            expanded,
        },

        getRowCanExpand,
        getSubRows: (row) => row.subModules || [],


        enableRowSelection: true,
        autoResetPageIndex: false,
        _features: [DensityFeature],

        filterFromLeafRows: true,
        maxLeafRowFilterDepth: 3,
        // paginateExpandedRows: false,


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

    useEffect(() => {
        if (globalFilter) {
            const ids = table.getFilteredRowModel().flatRows.map((row) => row.id);
            if (ids.length > 0) {
                const expandedState = convertToExpandedState(ids);
                setExpanded(expandedState);
            } else {
                setExpanded({});
                table.resetExpanded()
            }
        } else {
            setExpanded({});
            table.resetExpanded()
        }
    }, [globalFilter]);

    return (
        <div className="rounded-md border">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">Loading...</div>
            ) : (
                <>
                    <DataTableToolbar table={table} deleteRecord={deleteRecord} moduleId={moduleId} toolbar={toolbar} />
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
                                                    style={cell.column.id === "select" ? { width: "40px" } : {}}
                                                    className={cn("transition-[padding]", {
                                                        "p-1": density === "sm",
                                                        "p-2": density === "md",
                                                        "p-3": density === "lg",
                                                        "pl-[10px]": cell.column.id === "name" && row.depth === 1,
                                                        "pl-[20px]": cell.column.id === "name" && row.depth === 2,
                                                        "pl-[30px]": cell.column.id === "name" && row.depth === 3,
                                                    })}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {/* {row.getIsExpanded() && (renderSubComponent && renderSubComponent({ row }))} */}


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
                    {pageSize && <DataTablePagination table={table} />}
                </>
            )}
        </div>
    );
}

function convertToExpandedState(ids: string[]): { [key: string]: boolean } {
    return ids.reduce((acc, id) => {
        acc[id] = true;
        return acc;
    }, {} as { [key: string]: boolean });
}