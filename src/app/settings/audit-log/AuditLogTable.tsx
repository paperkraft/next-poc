'use client'

import { createColumns } from "@/components/data-table/column";
import { DataTable } from "@/components/data-table/data-table";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { InfoIcon, Monitor, SmartphoneIcon } from "lucide-react";
import { memo, useState } from "react";

interface AuditLogProp {
    data: {
        id: String,
        user: { firstName: string, lastName: string }
        action: String,
        entity: String,
        userId: String,
        details: Record<string, string | undefined>,
        device: Record<string, string | undefined>,
        timestamp: String
    }[]
}

const AuditLogTable = memo(({ data }: AuditLogProp) => {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState<Record<string, string | undefined>>();

    const columns = createColumns();

    const final = data?.map((item)=>{
        return {
            user: `${item.user.firstName} ${item.user.lastName}`,
            action: item.action.toLowerCase(),
            entity: item.entity,
            details: JSON.stringify(item.details, null, 2),
            device: JSON.stringify(item.device, null, 2),
            timestamp: `${new Date(item.timestamp as string).toLocaleString('en-IN')}`
        }
    })

    const renderRecursive = (val: any) => {
        if (typeof val === 'object' && val !== null) {
            return (
                <div className="pl-4">
                    {Object.entries(val).map(([nestedKey, nestedVal], idx) => (
                        <div key={idx} className="flex gap-2">
                            <p className="capitalize">{`${nestedKey}:`}</p>
                            {renderRecursive(nestedVal)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>{val}</p>;
        }
    }

    const actionStyles: Record<string, string> = {
        error: "bg-orange-100 border-orange-500 text-orange-500",
        delete: "bg-red-100 border-red-500 text-red-500",
        create: "bg-green-100 border-green-500 text-green-500",
        update: "bg-blue-100 border-blue-500 text-blue-500",
        login: "bg-violet-100 border-violet-500 text-violet-500",
    };

    return (
        <>
            <div className="space-y-8 p-2">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead>Date & Time</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data &&
                            data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.user.firstName} {item.user.lastName}</TableCell>
                                    <TableCell>
                                        <Badge variant={'outline'} className={cn(actionStyles[item.action.toLowerCase()] || "")}>
                                            {item.action.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.entity}</TableCell>
                                    <TableCell>
                                        <Button
                                            size={'icon'}
                                            variant={'ghost'}
                                            onClick={() => { setOpen(true); setDetails(item.details) }}
                                        >
                                            <InfoIcon className="size-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size={'icon'}
                                            variant={'ghost'}
                                            onClick={() => { setOpen(true); setDetails(item.device) }}
                                        >

                                            {
                                                item.device.device?.toLowerCase()?.includes('windows')
                                                    ? (<Monitor className="size-4" />)
                                                    : (<SmartphoneIcon className="size-4" />)
                                            }

                                        </Button>
                                    </TableCell>
                                    <TableCell>{new Date(item.timestamp as string).toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            ))}

                        {!data &&
                            <TableRow>
                                <TableCell colSpan={3}>No Data</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </div>

            {
                final && <DataTable columns={columns} data={final} />
            }

            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="mb-2">Details</AlertDialogTitle>
                        {details &&
                            Object.entries(details).map(([key, val], idx) => (
                                <div key={idx} className="flex gap-2">
                                    <p className="capitalize">{`${key}:`}</p>
                                    {renderRecursive(val)}
                                </div>
                            ))
                        }
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setOpen(false); }}>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
})

AuditLogTable.displayName = "AuditLogTable";
export default AuditLogTable;