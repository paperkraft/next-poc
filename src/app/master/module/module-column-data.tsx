"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const ModuleMasterColumns = () => {
    const path = usePathname();

    const columns: ColumnDef<any>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className={"mx-2 translate-y-0.5 data-[state=checked]:bg-sky-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-0 border-gray-400 shadow-none"}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className={"mx-2 translate-y-0.5 data-[state=checked]:bg-sky-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-0 border-gray-400 shadow-none"}
                />
            ),
            size: 50,
            maxSize: 100,
        },
        {
            accessorKey: "name",
            header: "Module",
            cell: ({row}) => {
                const { name, subModules } = row.original;
                const hasSubModules = subModules.length > 0;
                return(
                    <div className={cn({"flex gap-2 items-center cursor-pointer": hasSubModules})} aria-expanded={row.getIsExpanded()} onClick={row.getToggleExpandedHandler()}>
                        {name}
                        {
                            hasSubModules && row.getCanExpand() 
                            ?  row.getIsExpanded() 
                                ? <ChevronDownIcon className="size-4" />
                                : <ChevronRightIcon className="size-4" />
                            : null
                        }
                    </div>
                )
            }
        },
        {
            accessorKey: "view",
            header: () => null,
            cell: ({ row }) => (
                <Link href={`${path}/${row.original.id}`} className="hover:text-blue-500 block size-4"><Eye className="size-4" /></Link>
            ),
            enableSorting: false,
        }
    ], []);

    return { columns };
};