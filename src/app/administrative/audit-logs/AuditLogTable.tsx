'use client'

import React from "react";
import { getFormattedDateTime } from "@/utils";
import { DataTable } from "@/components/_data-table/data-table";
import { DetailsDialog } from "./view-details";
import { createColumns } from "./column-data";
interface AuditLogTableProp {
    data: {
        id: String,
        user: { firstName: string, lastName: string }
        action: String,
        entity: String,
        userId: String,
        details: Record<string, string | undefined>,
        device: Record<string, string | undefined>,
        timestamp: Date
    }[],
    moduleId?: string;
}

const AuditLogTable = ({ data, moduleId }: AuditLogTableProp) => {
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
            timestamp: getFormattedDateTime(new Date(item.timestamp)),
        })),
        [data]
    );

    const deleteRecord = async (ids: string | string[]) => {
        try {
            await fetch('/api/audit-log', {
                method: 'DELETE',
                body: JSON.stringify({ ids }),
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={final}
                pageSize={10}
                moduleId={moduleId}
                deleteRecord={deleteRecord}
                toolbar={["columns", "density", "export"]}
            />
            <DetailsDialog open={open} setOpen={setOpen} details={details} />
        </>
    );
}

export default AuditLogTable;