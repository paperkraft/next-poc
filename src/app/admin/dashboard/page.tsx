import { auth } from "@/auth";
import { TenantSwitcher } from "@/components/common/TenantSwithc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getTenantsForAdmin } from "@/lib/tenants";
import { BarChart3, Building, School, Users } from "lucide-react";

async function getDashboardStats() {
    try {
        return await prisma.$transaction(async (tx) => {
            const [tenantCount, userCount, activeUsers, totalSchools] = await Promise.all([
                tx.tenant.count(),
                tx.user.count(),
                tx.user.count({ where: { isActive: true } }),
                tx.tenant.count({ where: { type: 'SCHOOL' } })
            ]);

            return { tenantCount, userCount, activeUsers, totalSchools };
        });
    } finally {
        await prisma.$disconnect();
    }
}

export default async function AdminDashboard() {

    const session = await auth();
    const stats = await getDashboardStats();
    const tenants = await getTenantsForAdmin()

    const currentTenant = tenants.find(t => t.id === session?.user?.tenantId)

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
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        System overview and management console
                    </p>
                </div>

                <TenantSwitcher currentTenant={currentTenant} tenants={tenants} />

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
                                    <span className="text-sm text-blue-600 font-medium">{stats.activeUsers}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}