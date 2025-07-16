"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Activity, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react"
import { SystemMetricsChart } from "../charts/system-metrics-chart"
import { TenantActivityChart } from "../charts/tenant-activity-chart"
import { RecentTenantsTable } from "../tables/recent-tenants-table"

// Mock data
const systemStats = {
    totalTenants: 156,
    activeTenants: 142,
    totalUsers: 12847,
    activeUsers: 11203,
    systemHealth: 98.5,
    monthlyRevenue: 284750,
}

const recentAlerts = [
    {
        id: 1,
        type: "warning",
        message: "High CPU usage on server cluster 2",
        timestamp: "2 minutes ago",
    },
    {
        id: 2,
        type: "info",
        message: "New tenant registration: Westfield Academy",
        timestamp: "15 minutes ago",
    },
    {
        id: 3,
        type: "success",
        message: "Database backup completed successfully",
        timestamp: "1 hour ago",
    },
]

export function SystemAdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
                    <p className="text-muted-foreground">Monitor and manage your multi-tenant educational ERP system</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        System Healthy
                    </Badge>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{systemStats.totalTenants}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+12</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+573</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{systemStats.systemHealth}%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+0.2%</span> from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${systemStats.monthlyRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+8.2%</span> from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>System Performance</CardTitle>
                        <CardDescription>CPU, Memory, and Storage usage over the last 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SystemMetricsChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tenant Activity</CardTitle>
                        <CardDescription>User activity across different tenant types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TenantActivityChart />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity and Alerts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Tenants</CardTitle>
                        <CardDescription>Latest tenant registrations and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentTenantsTable />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Alerts</CardTitle>
                        <CardDescription>Recent system notifications and alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                    {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                                    {alert.type === "info" && <Clock className="h-4 w-4 text-blue-600 mt-0.5" />}
                                    {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{alert.message}</p>
                                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}