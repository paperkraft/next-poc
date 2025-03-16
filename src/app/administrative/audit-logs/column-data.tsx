"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InfoIcon, MonitorIcon, MoreHorizontalIcon, SmartphoneIcon } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface createColumnsProps {
    setOpen: (value: boolean) => void;
    setDetails: (value: Record<string, string | undefined> | null) => void;
}

const parseJson = (value: string) => {
    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
};

const DeviceIcon = ({
    device,
}: {
    device: string;
}) => {
    const isWindows = device.toLowerCase().includes("windows");
    const Icon = isWindows ? MonitorIcon : SmartphoneIcon;
    return (
        <Icon className="size-4 mr-2" />
    );
};

export const createColumns = ({ setOpen, setDetails }: createColumnsProps) => {

    const actionStyles: Record<string, string> = useMemo(() => ({
        login: "bg-violet-50 border-violet-300 text-violet-600 dark:bg-violet-50/5 dark:text-violet-500 dark:border-violet-500",
        error: "bg-orange-50 border-orange-300 text-orange-600 dark:bg-orange-50/5 dark:text-yellow-500 dark:border-yellow-500",
        create: "bg-green-50 border-green-300 text-green-600 dark:bg-green-50/5 dark:text-green-500 dark:border-green-500",
        update: "bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-50/5 dark:text-blue-500 dark:border-blue-500",
        upsert: "bg-pink-50 border-pink-300 text-pink-600 dark:bg-pink-50/5 dark:text-pink-500 dark:border-pink-500",
        delete: "bg-red-50 border-red-300 text-red-600 dark:bg-red-50/5 dark:text-red-500 dark:border-red-500",
    }), []);

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
            enableSorting: false,
            header: () => <div className="hidden lg:table-cell">Entity</div>,
            cell: ({ row }) => <span className="hidden lg:table-cell">{row.original.entity}</span>,
        },
        {
            accessorKey: "timestamp",
            header: "Timestamp",
            cell: ({ row }) => <p className="text-wrap w-24 lg:w-auto">{row.original.timestamp}</p>,
        },
        {
            accessorKey: "info",
            header: "Info",
            enableSorting: false,
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontalIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>View</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => {
                                    setOpen(true);
                                    setDetails(parseJson(data.details));
                                }}
                                className="hover:text-blue-500 cursor-pointer"
                            >
                                <InfoIcon className="size-4 mr-2" />
                                Details
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                                onClick={() => {
                                    setOpen(true);
                                    setDetails(parseJson(data.device));
                                }}
                                className="hover:text-blue-500 cursor-pointer"
                            >
                                <DeviceIcon device={data.device ?? ""}/>
                                Device
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        },
    ], [actionStyles, setOpen, setDetails]);

    return { columns };
};