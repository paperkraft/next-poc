"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo } from "react";

export const LoginSessionColumns = () => {

  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Button variant='ghost' size="icon" className="size-6 cursor-pointer" onClick={table.getToggleAllRowsExpandedHandler()}>
          {table.getIsAllRowsExpanded() ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      ),
      cell: ({ row }) => (
        <Button variant='ghost' size="icon" className="size-6 cursor-pointer" onClick={row.getToggleExpandedHandler()}>
          {row.getIsExpanded() ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      ),
      size: 50,
      maxSize: 100,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "loginTime",
      header: "Login Time",
      cell: () => null,
      enableSorting: false,
    },
    {
      accessorKey: "logoutTime",
      header: "Logout Time",
      cell: () => null,
      enableSorting: false,
    },
    {
      accessorKey: "duration",
      header: "Duration (H)",
      cell: () => null,
      enableSorting: false,
    },
  ], []);

  return { columns };
};