"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const RoleMasterColumns = () => {
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
    },
    {
      accessorKey: "name",
      header: "Role",
    },
    {
      accessorKey: "view",
      header: () => null,
      cell: ({ row }) => (
        <Link
          title="View"
          href={`${path}/${row.original.id}`}
          className="opacity-0 group-hover:opacity-100 hover:text-blue-500 block size-4"
        >
          <Eye size={16} aria-label="View"/>
        </Link>
      ),
      enableSorting: false,
    }
  ], []);

  return { columns };
};