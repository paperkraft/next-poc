"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InfoIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { Button } from "../ui/button";
import { HTMLProps, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const createColumns = () => {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState<Record<string, string | undefined>>();

    const actionStyles: Record<string, string> = {
        error: "bg-orange-50 border-orange-300 text-orange-600",
        delete: "bg-red-50 border-red-300 text-red-600",
        create: "bg-green-50 border-green-300 text-green-600",
        update: "bg-blue-50 border-blue-300 text-blue-600",
        login: "bg-violet-50 border-violet-300 text-violet-600",
    };

    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        {
            accessorKey: "user",
            header: "User",
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <Badge variant={'outline'} className={cn(actionStyles[row.original.action.toLowerCase()] || "")}>
                    {row.original.action.toLowerCase()}
                </Badge>
            )
        },
        {
            accessorKey: "entity",
            header: "Entity",
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => {
                const details = JSON.parse(row.original.details);
                return (
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="hover:text-blue-500"
                        onClick={() => { setOpen(true); setDetails(details); }}
                    >
                        <InfoIcon className="size-4" />
                    </Button>
                )
            }
        },
        {
            accessorKey: "device",
            header: "Device",
            cell: ({ row }) => {
                const device = JSON.parse(row.original.device);
                return (
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="hover:text-blue-500"
                        onClick={() => { setOpen(true); setDetails(device); }}
                    >
                        {
                            device.device?.toLowerCase()?.includes('windows')
                                ? (<MonitorIcon className="size-4" />)
                                : (<SmartphoneIcon className="size-4" />)
                        }
                    </Button>
                )
            }
        },
        {
            accessorKey: "timestamp",
            header: "Date and Time",
        },
    ];

    return { columns, open, details, setOpen, setDetails };
};


function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}