"use client"

import { User, Database, Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuditLog } from "@/context/audit-log-context"

export function AuditLogTable() {
    const { paginatedLogs, filteredLogs, getActionIcon, getActionColor, formatDate, setSelectedLog, setOpen } = useAuditLog()

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Audit Log Entries</CardTitle>
                <CardDescription className="text-sm text-gray-500">{filteredLogs.length} total entries</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Action</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLogs.length > 0 ? (
                                paginatedLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <Badge className={cn("flex items-center gap-1 w-fit", getActionColor(log.action))}>
                                                {getActionIcon(log.action)}
                                                <span>{log.action}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="font-medium">{log.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">ID: {log.userId}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{log.tenant?.name || "N/A"}</div>
                                            <div className="text-sm text-muted-foreground">ID: {log.tenantId || "N/A"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Database className="w-4 h-4 text-gray-400 mr-2" />
                                                <span>{log.entity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                <span>{formatDate(log.createdAt)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => { setSelectedLog(log); setOpen(true) }}
                                                className="flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No logs found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
