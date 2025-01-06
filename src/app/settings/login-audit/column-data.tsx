"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo } from "react";

export const LoginSessionColumns = () => {

    const actionStyles: Record<string, string> = useMemo(() => ({
        login: "bg-violet-50 border-violet-300 text-violet-600",
        error: "bg-orange-50 border-orange-300 text-orange-600",
        create: "bg-green-50 border-green-300 text-green-600",
        update: "bg-blue-50 border-blue-300 text-blue-600",
        upsert: "bg-pink-50 border-pink-300 text-pink-600",
        delete: "bg-red-50 border-red-300 text-red-600",
    }), []);

    const columns: ColumnDef<any>[] = useMemo(() => [
        {
            id: 'expander',
            header: () => null,
            cell: ({ row }) => {
              return row.getCanExpand() ? (
                <Button
                    variant={'ghost'}
                    size={'icon'}
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' },
                  }}
                >
                  {/* {row.getIsExpanded() ? '👇' : '👉'} */}
                  {row.getIsExpanded() ? <><ChevronDown className="size-4"/></> : <><ChevronRight className="size-4"/></>}
                </Button>
              ) : (
                null
              )
            },
        },
        {
            accessorKey: "date",
            header: "Date",
        },
         
        {
            accessorKey: "session",
            header: "Session",
        },
         
    ], [actionStyles]);

    return { columns };
};