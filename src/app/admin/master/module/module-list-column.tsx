"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useMount } from '@/hooks/use-mount';
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface ModuleNode {
    id: number;
    name: string;
    groupName?: string;
    subModules?: ModuleNode[];
}

export const ModuleMasterColumns = () => {

    const isMounted = useMount();
    const path = usePathname();

    const columns: ColumnDef<ModuleNode>[] = useMemo(() => [
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
        },
        {
            accessorKey: "name",
            header: "Module",
            enableExpanding: true,
            cell: ({ row, getValue }) => {
                const { subModules } = row.original;
                const hasSubModules = subModules && subModules?.length > 0;
                return (
                    <div className={cn({ "flex gap-2 items-center cursor-pointer": hasSubModules })}
                        aria-expanded={row.getIsExpanded()}
                        onClick={row.getToggleExpandedHandler()}
                    >
                        <Link
                            title={`${row.original.name}`}
                            prefetch={false}
                            href={`${path}/${row.original.id}`}
                            aria-label={`View details for module ${row.original.name}`}
                            className="hover:text-primary hover:font-medium"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {getValue<boolean>()}
                        </Link>

                        {hasSubModules && row.getCanExpand() && (row.getIsExpanded() ? <ChevronDownIcon className="size-4" /> : <ChevronRightIcon className="size-4" />)}
                    </div>
                )
            }
        },
        {
            accessorKey: "groupName",
            header: "Group",
            cell: ({ row }) => {
                const { groupName } = row.original;
                return <span className="text-sm text-gray-500">{groupName}</span>;
            }
        }
    ], [path]);

    return isMounted ? { columns } : { columns: [] };
};