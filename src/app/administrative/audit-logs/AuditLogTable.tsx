'use client'

import React from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/components/_data-table/data-table';
import { getFormattedDateTime } from '@/utils';
import { AuditAction } from '@prisma/client';

import { createColumns } from './column-data';
import { DetailsDialog } from './view-details';

interface AuditLogTableProp {
    moduleId?: string;
    data: {
        id: String,
        user: { profile: { firstName: string, lastName: string } }
        action: AuditAction,
        entity: String,
        userId: String,
        tenantId: String | null,
        slug: String | null,
        details: Record<string, string | undefined>,
        device: Record<string, string | undefined>,
        createdAt: Date
    }[],

}

const AuditLogTable = ({ data, moduleId }: AuditLogTableProp) => {
    const [open, setOpen] = React.useState(false);
    const [details, setDetails] = React.useState<Record<string, string | undefined> | null>(null);

    const { columns } = createColumns({ setOpen, setDetails });

    const final = React.useMemo(() =>
        data?.map((item) => ({
            id: item.id,
            name: `${item?.user?.profile?.firstName} ${item?.user?.profile?.lastName}`,
            action: item?.action.toLowerCase(),
            entity: item?.entity,
            slug: item?.slug,
            details: JSON.stringify(item?.details, null, 2),
            device: JSON.stringify(item?.device, null, 2),
            timestamp: getFormattedDateTime(new Date(item?.createdAt)),
        })),
        [data]
    );

    const deleteRecord = async (id: string | string[]) => {
        const ids = Array.isArray(id) ? id : [id];

        try {
            const res = await fetch('/api/audit-log', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Log deleted successfully");
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("Error deleting log");
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