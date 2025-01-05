import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableSearchProps<TData> {
    table: Table<TData>
}

export function DataTableSearch<TData>({ table }: DataTableSearchProps<TData>) {

    const globalFilter = table.getState().globalFilter ?? "";

    return (
        <div className="relative w-full max-w-sm">
            <Input
                placeholder="Search"
                value={globalFilter}
                onChange={e => table.setGlobalFilter(String(e.target.value))}
            />
            {
                globalFilter?.length > 0 &&
                <X onClick={() => table.resetGlobalFilter()}
                    className={cn("opacity-50 hover:opacity-100 size-7 absolute top-[50%] right-1 -translate-y-1/2 px-1.5 font-normal cursor-pointer")}
                />
            }
        </div>
    )
}