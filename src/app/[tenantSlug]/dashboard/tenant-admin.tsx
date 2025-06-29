import { BarChart3, BookOpen, GraduationCap, UserCog, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

async function getTenantStats(tenantId: number) {
    try {
        return await prisma.$transaction(async (tx) => {
            const [userCount, activeUsers, roleCount] = await Promise.all([
                tx.user.count({ where: { tenantId } }),
                tx.user.count({ where: { tenantId, isActive: true } }),
                tx.role.count({ where: { tenantId } })
            ]);

            const [facultyCount, studentCount] = await Promise.all([
                tx.user.count({
                    where: {
                        tenantId,
                        role: { name: 'FACULTY' }
                    }
                }),
                tx.user.count({
                    where: {
                        tenantId,
                        role: { name: { in: ['STUDENT', 'PARENT'] } }
                    }
                })
            ]);

            const recentUsers = await tx.user.findMany({
                where: { tenantId },
                include: {
                    profile: true,
                    role: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            return {
                userCount,
                activeUsers,
                roleCount,
                facultyCount,
                studentCount,
                recentUsers
            };
        });
    } finally {
        await prisma.$disconnect();
    }
}

export default async function TenantAdminDashboard() {

    const session = await auth();
    const cookieTenantId = cookies().get('x-tenant-id')?.value
    const tenantId = session?.user.tenantId ?? cookieTenantId

    const stats = await getTenantStats(+tenantId)

    const statCards = [
        {
            title: "Total Users",
            value: stats.userCount,
            icon: Users,
            description: "All users in organization",
            color: "text-blue-600"
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: BarChart3,
            description: "Currently active users",
            color: "text-green-600"
        },
        {
            title: "Faculty Members",
            value: stats.facultyCount,
            icon: GraduationCap,
            description: "Teaching staff",
            color: "text-purple-600"
        },
        {
            title: "Students",
            value: stats.studentCount,
            icon: BookOpen,
            description: "Students and parents",
            color: "text-orange-600"
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Manage your organization's users, roles, and settings
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                            {user.profile ?
                                                `${user.profile.firstName[0]}${user.profile.lastName[0]}` :
                                                user.email[0].toUpperCase()
                                            }
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user.profile ?
                                                `${user.profile.firstName} ${user.profile.lastName}` :
                                                user.email
                                            }
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user.role.name} • {user.email}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium">Add New User</p>
                                        <p className="text-sm text-gray-500">Create a new user account</p>
                                    </div>
                                </div>
                            </button>

                            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <UserCog className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="font-medium">Manage Roles</p>
                                        <p className="text-sm text-gray-500">Configure roles and permissions</p>
                                    </div>
                                </div>
                            </button>

                            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <BarChart3 className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium">View Reports</p>
                                        <p className="text-sm text-gray-500">Generate usage reports</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{Math.round((stats.activeUsers / stats.userCount) * 100)}%</p>
                            <p className="text-sm text-gray-600">User Activity Rate</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{stats.roleCount}</p>
                            <p className="text-sm text-gray-600">Custom Roles</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">
                                {stats.facultyCount > 0 ? Math.round(stats.studentCount / stats.facultyCount) : 0}:1
                            </p>
                            <p className="text-sm text-gray-600">Student-Faculty Ratio</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}