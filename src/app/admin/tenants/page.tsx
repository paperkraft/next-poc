import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Building2, Users, Calendar } from "lucide-react"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button";
import TenantsTable from "./component/tenants-table";

async function getTenantStats() {
    try {
        const [tenants, tenantCount, userCount, activeUsers, totalSchools] = await Promise.all([
            prisma.tenant.findMany({
                where: { isActive: true },
                include: { users: { select: { id: true } } }
            }),
            prisma.tenant.count(),
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.tenant.count({ where: { type: 'SCHOOL' } })
        ]);

        return { tenants, tenantCount, userCount, activeUsers, totalSchools };
    } catch (err) {
        console.error("Error fetching tenant stats:", err);
        return null;
    }
}


export default async function TenantsPage() {

    const stats = await getTenantStats();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
                    <p className="text-muted-foreground">Manage all tenants in your educational ERP system</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tenant
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.tenantCount ?? 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.tenants.length ?? 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.userCount.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+3</div>
                        <p className="text-xs text-muted-foreground">New tenants</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tenants Table */}
            <TenantsTable tenants={stats?.tenants ?? []} />

        </div>
    )
}
