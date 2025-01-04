import type { Table } from "@tanstack/react-table"
import { Check, ChevronsUpDown, Columns3Icon } from "lucide-react"

import { cn, toSentenceCase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DataTableViewColumnProps<TData> {
    table: Table<TData>
}

export function DataTableViewColumn<TData>({ table }: DataTableViewColumnProps<TData>) {
    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button variant="outline" aria-label="Toggle columns">
                    <Columns3Icon className="size-4" />
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
                                            <Check
                                                className={cn(
                                                    "ml-auto size-4 shrink-0",
                                                    column.getIsVisible() ? "opacity-100" : "opacity-0"
                                                )}
                                            />
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