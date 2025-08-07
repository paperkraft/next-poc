import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuditLog } from "@/context/audit-log-context" // Import the hook

export function AuditLogDetailDialog() {
    const { open, setOpen, selectedLog, getActionIcon, getActionColor, formatDate } = useAuditLog()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Audit Log Details</DialogTitle>
                    <DialogDescription>Detailed information about the selected audit log entry.</DialogDescription>
                </DialogHeader>
                {selectedLog && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                <div className="font-medium text-gray-700">Log ID:</div>
                                <div className="text-gray-900">{selectedLog.id}</div>

                                <div className="font-medium text-gray-700">Action:</div>
                                <div className="text-gray-900">
                                    <Badge className={cn("flex items-center gap-1 w-fit", getActionColor(selectedLog.action))}>
                                        {getActionIcon(selectedLog.action)}
                                        <span>{selectedLog.action}</span>
                                    </Badge>
                                </div>

                                <div className="font-medium text-gray-700">User:</div>
                                <div className="text-gray-900">
                                    {selectedLog.user.name} (ID: {selectedLog?.user?.id})
                                </div>

                                <div className="font-medium text-gray-700">Tenant:</div>
                                <div className="text-gray-900">
                                    {selectedLog.tenant?.name || "N/A"} (ID: {selectedLog?.tenant?.id || "N/A"})
                                </div>

                                <div className="font-medium text-gray-700">Entity:</div>
                                <div className="text-gray-900">{selectedLog.entity}</div>

                                <div className="font-medium text-gray-700">Slug:</div>
                                <div className="text-gray-900">{selectedLog?.tenant?.slug || "N/A"}</div>

                                <div className="font-medium text-gray-700">Timestamp:</div>
                                <div className="text-gray-900">{formatDate(selectedLog.createdAt)}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Device Information</h3>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                <div className="font-medium text-gray-700">Device Type:</div>
                                <div className="text-gray-900">{selectedLog.device?.type || "N/A"}</div>

                                <div className="font-medium text-gray-700">Operating System:</div>
                                <div className="text-gray-900">{selectedLog.device?.os || "N/A"}</div>

                                <div className="font-medium text-gray-700">Browser:</div>
                                <div className="text-gray-900">{selectedLog.device?.browser || "N/A"}</div>

                                <div className="font-medium text-gray-700">IP Address:</div>
                                <div className="text-gray-900">{selectedLog.device?.ip || "N/A"}</div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                            <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto border max-h-64 overflow-auto">
                                {JSON.stringify(selectedLog.details, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}