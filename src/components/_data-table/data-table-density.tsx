import { Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button";
import { DensityState } from "@/utils/tanstack-utils";
import { CheckIcon, ChevronsUpDownIcon, Rows3Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableDensityProps<TData> {
    table: Table<TData>
}

export function DataTableDensity<TData>({ table }: DataTableDensityProps<TData>) {

    const density = table.getState()?.density;
    const densities = [
        { label: "Compact", value: "sm" },
        { label: "Standard", value: "md" },
        { label: "Comfortable", value: "lg" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    <Rows3Icon className="size-4" />
                    Density
                    <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    {densities.map(({ label, value }) => (
                        <DropdownMenuItem
                            key={value}
                            onClick={() => table.setDensity(value as DensityState)}
                            className={cn({ "bg-accent": density === value })}
                        >
                            {label}
                            <CheckIcon className={cn("ml-auto size-4 shrink-0", density === value ? "opacity-100" : "opacity-0")} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
