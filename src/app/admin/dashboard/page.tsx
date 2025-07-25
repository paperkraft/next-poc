import AllowNotification from "@/components/custom/allow-notification";
import { SystemAdminDashboard } from "@/components/dashboard/system-admin-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { BarChart3, Building, School, Users } from "lucide-react";

async function getDashboardStats() {
    try {
        const [tenantCount, userCount, activeUsers, totalSchools] = await Promise.all([
            prisma.tenant.count(),
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.tenant.count({ where: { type: 'SCHOOL' } }),
        ]);

        return { tenantCount, userCount, activeUsers, totalSchools };
    } catch (err) {
        console.error(err);
        return null;
    }
}


export default async function AdminDashboard() {

    const stats = await getDashboardStats();
    const statCards = [
        {
            title: "Total Tenants",
            value: stats?.tenantCount ?? 0,
            icon: Building,
            description: "All registered organizations"
        },
        {
            title: "Total Users",
            value: stats?.userCount ?? 0,
            icon: Users,
            description: "System-wide user count"
        },
        {
            title: "Active Users",
            value: stats?.activeUsers ?? 0,
            icon: BarChart3,
            description: "Currently active users"
        },
        {
            title: "Schools",
            value: stats?.totalSchools ?? 0,
            icon: School,
            description: "Educational institutions"
        }
    ]

    return (
        <>
            <AllowNotification />
            <div className="hidden">
                <SystemAdminDashboard />
            </div>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                    <p className="mt-2 text-muted">
                        System overview and management console
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Tenant Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm text-gray-500">
                                    Recent tenant registrations and activities will be displayed here
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Database Status</span>
                                    <span className="text-sm text-green-600 font-medium">Healthy</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">API Response Time</span>
                                    <span className="text-sm text-green-600 font-medium">{`< 100ms`}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Active Sessions</span>
                                    <span className="text-sm text-blue-600 font-medium">{stats?.activeUsers ?? 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}