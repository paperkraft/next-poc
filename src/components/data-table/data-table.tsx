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
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpNarrowWide, InfoIcon } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState<Record<string, string | undefined>>();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,

        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
            globalFilter,
        },
    });



    const renderRecursive = (val: any) => {
        if (typeof val === 'object' && val !== null) {
            return (
                <div className="pl-4">
                    {Object.entries(val).map(([nestedKey, nestedVal], idx) => (
                        <div key={idx} className="flex gap-2">
                            <p className="capitalize">{`${nestedKey}:`}</p>
                            {renderRecursive(nestedVal)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>{val}</p>;
        }
    }
     

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">

                    <Input
                        placeholder="Search"
                        onChange={e => table.setGlobalFilter(String(e.target.value))}
                        className="max-w-sm"
                    />

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
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {header.column.getIsSorted() ? (
                                                                header.column.getIsSorted() === "desc" ? (
                                                                    <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                                                                ) : (
                                                                    <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                                                                )
                                                            ) : (
                                                                <ArrowDownUp className="ml-2 h-4 w-4" />
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
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}

                                                {cell.column.id === "details" && (
                                                    <Button
                                                        size={'icon'}
                                                        variant={'ghost'}
                                                        onClick={() => { setOpen(true); setDetails(cell.getValue() as any) }}
                                                    >
                                                        <InfoIcon className="size-4" />
                                                    </Button>
                                                )}
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

                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="mb-2">Details</AlertDialogTitle>
                        {details &&
                            Object.entries(details).map(([key, val], idx) => (
                                <div key={idx} className="flex gap-2">
                                    <p className="capitalize">{`${key}:`}</p>
                                    {renderRecursive(val)}
                                </div>
                            ))
                        }
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setOpen(false); }}>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}