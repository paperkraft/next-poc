'use client'

import { memo } from "react";
import { InfoIcon, Monitor, SmartphoneIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/column";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

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
    const { columns, open, details, setOpen, setDetails } = createColumns();

    const final = data?.map((item) => {
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