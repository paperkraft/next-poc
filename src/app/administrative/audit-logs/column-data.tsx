"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InfoIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface createColumnsProps {
    setOpen: (value: boolean) => void;
    setDetails: (value: Record<string, string | undefined> | null) => void;
}

export const createColumns = ({ setOpen, setDetails }: createColumnsProps) => {

    const actionStyles: Record<string, string> = useMemo(() => ({
        login: "bg-violet-50 border-violet-300 text-violet-600 dark:bg-violet-50/5 dark:text-violet-400",
        error: "bg-orange-50 border-orange-300 text-orange-600 dark:bg-orange-50/5 dark:text-orange-400",
        create: "bg-green-50 border-green-300 text-green-600 dark:bg-green-50/5 dark:text-green-400",
        update: "bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-50/5 dark:text-blue-400",
        upsert: "bg-pink-50 border-pink-300 text-pink-600 dark:bg-pink-50/5 dark:text-pink-400",
        delete: "bg-red-50 border-red-300 text-red-600 dark:bg-red-50/5 dark:text-red-400",
    }), []);

    const columns: ColumnDef<any>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="px-1 ml-1">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className={"translate-y-0.5 data-[state=checked]:bg-sky-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-0 border-gray-400 shadow-none"}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1 ml-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className={"translate-y-0.5 data-[state=checked]:bg-sky-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-0 border-gray-400 shadow-none"}
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
            enableSorting: false,
            cell: ({ row }) => {
                const details = (() => {
                    try {
                        return JSON.parse(row.original.details);
                    } catch {
                        return {};
                    }
                })();
                return (
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="hover:text-blue-500 size-7"
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
            enableSorting: false,
            cell: ({ row }) => {
                const device = (() => {
                    try {
                        return JSON.parse(row.original.device);
                    } catch {
                        return {};
                    }
                })();
                return (
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="hover:text-blue-500 size-7"
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
    ], [actionStyles, setOpen, setDetails]);

    return { columns };
};