import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

import { PermissionProvider } from '@/context/permission-context';
import { RoleSelectorWidget } from '@/components/tenant-admin/role-permission/role-selector-widget';
import { PermissionAssignmentWidget } from '@/components/tenant-admin/role-permission/permission-assignment-widget';
import { PermissionOverviewWidget } from '@/components/tenant-admin/role-permission/permission-overview-widget';
import { SearchWidget } from '@/components/tenant-admin/role-permission/search-widget';
import { SaveWidget } from '@/components/tenant-admin/role-permission/save-widget';
import { PermissionGridWidget } from '@/components/tenant-admin/role-permission/permission-grid-widget';

export default async function Page() {

    const session = await auth();

    if (!session) {
        redirect('/signin')
    }

    const roles = await prisma.role.findMany({
        where: { tenantId: +session?.user.tenantId },
        select: { id: true, name: true, description: true, tenantId: true }
    });

    return (
        <div className='max-w-7xl'>
            <PermissionProvider tenantId={+session?.user.tenantId} roles={roles}>
                <div className="min-h-screen bg-gray-50 rounded-lg">
                    <div className="container mx-auto p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Permission Management</h1>
                            <p className="text-muted-foreground">Assign and manage role-based permissions with our widget-based interface</p>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Left Sidebar */}
                            <div className="col-span-3 space-y-6">
                                <RoleSelectorWidget roles={roles} />
                                <PermissionAssignmentWidget />
                                <PermissionOverviewWidget />
                            </div>

                            {/* Main Content */}
                            <div className="col-span-9 space-y-6">
                                <SearchWidget />
                                <SaveWidget />
                                <PermissionGridWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </PermissionProvider>

        </div>
    );
}
