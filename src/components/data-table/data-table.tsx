"use client";

import { useState } from "react";
import {
    ColumnDef,
    flexRender,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    PaginationState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, ArrowDownWideNarrow, ArrowLeft, ArrowUpNarrowWide, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            globalFilter,
            rowSelection,
        },

        enableRowSelection: true,
        autoResetPageIndex: false,
        
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input placeholder="Search" className="max-w-sm" onChange={e => table.setGlobalFilter(String(e.target.value))}/>
                <div>
                    {Object.keys(rowSelection).length} of {table.getPreFilteredRowModel().rows.length} Total Rows Selected
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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
            </div>

            <div className="flex items-center justify-between space-x-2">

                <div className="flex gap-4">
                    <select value={table.getState().pagination.pageSize} onChange={e => { table.setPageSize(Number(e.target.value))}}>
                        {[5, 10, 20, 30, 40, 50].map(pageSize => ( <option key={pageSize} value={pageSize}>Show {pageSize}</option>))}
                    </select>

                    <p>Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()} Rows</p>
                </div>
                
                <div className="flex gap-2 items-center">
                    <Button variant="outline" size="icon" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeft className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <div>
                        <p>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <ChevronRight className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                        <ChevronsRight className="size-4" />
                    </Button>
                </div>
            </div>
            
        </div>
    );
}