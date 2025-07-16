"use client"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react" // Import new icons
import { Button } from "@/components/ui/button"
import { useAuditLog } from "@/context/audit-log-context"

export function AuditLogPagination() {
    const { currentPage, totalPages, filteredLogs, logsPerPage, setCurrentPage } = useAuditLog()

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * logsPerPage + 1} to {Math.min(currentPage * logsPerPage, filteredLogs.length)} of{" "}
                {filteredLogs.length} results
            </div>
            <div className="flex items-center space-x-2">
                {/* First Page Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="Go to first page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only ml-1">First</span>
                </Button>

                {/* Previous Page Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only ml-1">Previous</span>
                </Button>

                {/* Current Page Indicator (Optional, can be removed if desired) */}
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>

                {/* Next Page Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                >
                    <span className="sr-only sm:not-sr-only mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to last page"
                >
                    <span className="sr-only sm:not-sr-only mr-1">Last</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
