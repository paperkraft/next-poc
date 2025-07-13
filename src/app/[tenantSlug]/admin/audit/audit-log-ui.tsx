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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading audit logs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <AuditLogFilters />
                <AuditLogTable />
                <AuditLogPagination />
            </div>
            <AuditLogDetailDialog />
        </div>
    )
}

const AuditLogUI = () => {
    return (
        <AuditLogProvider>
            <AuditLogContent />
        </AuditLogProvider>
    )
}

export default AuditLogUI