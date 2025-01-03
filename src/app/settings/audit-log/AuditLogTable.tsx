'use client'

import { memo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/app/settings/audit-log/column-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
    const { columns, open, details, setOpen } = createColumns();

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

    return (
        <>
            {
                final && <DataTable columns={columns} data={final} />
            }

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent aria-describedby="content" className={"overflow-y-scroll max-h-screen"}>
                    <DialogHeader>
                        <DialogTitle className="mb-4">Details</DialogTitle>
                        <>
                            {details &&
                                Object.entries(details).map(([key, val], idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <p className="capitalize">{`${key}:`}</p>
                                        {renderRecursive(val)}
                                    </div>
                                ))
                            }
                        </>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
})

AuditLogTable.displayName = "AuditLogTable";
export default AuditLogTable;