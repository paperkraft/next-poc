"use client"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuditLog } from "@/context/audit-log-context" // Import the hook

export function AuditLogFilters() {
    const { filters, handleFilterChange, clearFilters, showFilters, setShowFilters } = useAuditLog()

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">Audit Logs</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">Track all system activities and changes.</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                        </Button>
                        <Button variant="ghost" onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800">
                            Clear All
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by user, entity, tenant, or details..."
                        className="pl-10 pr-4 py-2 w-full"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>
            </CardHeader>
            {showFilters && (
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <div>
                            <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Action
                            </label>
                            <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
                                <SelectTrigger id="action-filter">
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Actions">All Actions</SelectItem>
                                    <SelectItem value="CREATE">Create</SelectItem>
                                    <SelectItem value="UPDATE">Update</SelectItem>
                                    <SelectItem value="DELETE">Delete</SelectItem>
                                    <SelectItem value="LOGIN">Login</SelectItem>
                                    <SelectItem value="LOGOUT">Logout</SelectItem>
                                    <SelectItem value="ERROR">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="user-id-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <Input
                                id="user-id-filter"
                                type="text"
                                placeholder="User ID"
                                value={filters.userId}
                                onChange={(e) => handleFilterChange("userId", e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="tenant-id-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Tenant ID
                            </label>
                            <Input
                                id="tenant-id-filter"
                                type="text"
                                placeholder="Tenant ID"
                                value={filters.tenantId}
                                onChange={(e) => handleFilterChange("tenantId", e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="entity-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Entity
                            </label>
                            <Input
                                id="entity-filter"
                                type="text"
                                placeholder="Entity type"
                                value={filters.entity}
                                onChange={(e) => handleFilterChange("entity", e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="date-from-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Date From
                            </label>
                            <Input
                                id="date-from-filter"
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="date-to-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Date To
                            </label>
                            <Input
                                id="date-to-filter"
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
