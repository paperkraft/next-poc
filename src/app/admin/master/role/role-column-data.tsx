"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { useMount } from '@/hooks/use-mount';
import { ColumnDef } from '@tanstack/react-table';

export const RoleMasterColumns = () => {

  const isMount = useMount();
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
      cell: ({ row, getValue }) => (
        <Link
          title={`${row.original.name}`}
          prefetch={false}
          href={`${path}/${row.original.id}`}
          aria-label={`View details for role ${row.original.name}`}
          className="hover:text-primary"
        >
          {getValue<boolean>()}
        </Link>
      ),
    }
  ], [path]);

  return isMount ? { columns } : { columns: [] };
};