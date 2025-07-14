"use client"

import { AuditLogDetailDialog } from "@/components/_audit-log/audit-log-detail-dialog";
import { AuditLogFilters } from "@/components/_audit-log/audit-log-filters";
import { AuditLogPagination } from "@/components/_audit-log/audit-log-pagination";
import { AuditLogTable } from "@/components/_audit-log/audit-log-table";
import { AuditLogProvider, useAuditLog } from "@/context/audit-log-context";

const AuditLogContent = () => {
    const { loading } = useAuditLog()

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading audit logs...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="space-y-6">
                {/* <AuditLogFilters /> */}
                <AuditLogTable />
                <AuditLogPagination />
            </div>
            <AuditLogDetailDialog />
        </div>
    )
}

const AuditLogUI = ({ data }: { data: any[] }) => {
    return (
        <AuditLogProvider data={data}>
            <AuditLogContent />
        </AuditLogProvider>
    )
}

export default AuditLogUI