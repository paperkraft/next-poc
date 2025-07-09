import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

import RolePermissionTable from '@/components/tenant-admin/role-permission-table';

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
            <RolePermissionTable roles={roles} tenantId={session.user.tenantId} />
        </div>
    );
}
