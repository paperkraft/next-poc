'use client'
import type { Table } from "@tanstack/react-table"
import { ChevronsUpDown, EyeIcon, EyeOffIcon } from "lucide-react"
import { toSentenceCase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface DataTableViewColumnProps<TData> {
    table: Table<TData>
}

export function DataTableViewColumn<TData>({ table }: DataTableViewColumnProps<TData>) {
    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button variant="outline" aria-label="Toggle columns">
                    <EyeOffIcon className="size-4" />
                    Columns
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-0">
                <Command>
                    <CommandInput placeholder="Search columns..." />
                    <CommandList>
                        <CommandEmpty>No columns found.</CommandEmpty>
                        <CommandGroup>
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <CommandItem
                                            key={column.id}
                                            onSelect={() =>
                                                column.toggleVisibility(!column.getIsVisible())
                                            }
                                        >
                                            <span className="truncate">
                                                {toSentenceCase(column.id)}
                                            </span>
                                            {column.getIsVisible()
                                                ? <EyeIcon className="ml-auto size-4 shrink-0" />
                                                : <EyeOffIcon className="ml-auto size-4 shrink-0" />
                                            }
                                        </CommandItem>
                                    )
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}