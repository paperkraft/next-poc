'use client'

import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/app/settings/audit-log/column-data";
import { DateWiseOnlineSession } from "@/app/action/audit.action";
import { DetailsDialog } from "./view-details";
import React from "react";

interface AuditLogTableProp {
    data: {
        id: String,
        user: { firstName: string, lastName: string }
        action: String,
        entity: String,
        userId: String,
        details: Record<string, string | undefined>,
        device: Record<string, string | undefined>,
        timestamp: String
    }[],
    sessionwise?: DateWiseOnlineSession[] | null
}

const AuditLogTable = ({ data }: AuditLogTableProp) => {
    const [open, setOpen] = React.useState(false);
    const [details, setDetails] = React.useState<Record<string, string | undefined> | null>(null);

    const { columns } = createColumns({ setOpen, setDetails });

    const final = React.useMemo(() => 
        data?.map((item) => ({
            id: item.id,
            user: `${item.user.firstName} ${item.user.lastName}`,
            action: item.action.toLowerCase(),
            entity: item.entity,
            details: JSON.stringify(item.details, null, 2),
            device: JSON.stringify(item.device, null, 2),
            timestamp: `${new Date(item.timestamp as string).toLocaleString('en-IN')}`
        })), 
        [data]
    );

    return (
        <>
            {final && (<DataTable columns={columns} data={final} />)}
            <DetailsDialog open={open} setOpen={setOpen} details={details} />
        </>
    );
}

export default AuditLogTable;