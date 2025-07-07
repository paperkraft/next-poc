import { getTenantWidgets } from '@/app/action/tenant-widgets';
import { auth } from '@/auth';
import { AdminWidgetAssignmentPanel } from '@/components/admin/WidgetAssignmentPanel';

export default async function TenantWidgetsPage({
    params
}: {
    params: { tenantId: string }
}) {
    const session = await auth()
    if (!session?.user?.globalRoles.includes('SYSTEM_ADMIN')) {
        return <div>Unauthorized</div>
    }

    const { allWidgets, tenantWidgets } = await getTenantWidgets(
        Number(params.tenantId)
    )

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Manage Widget Assignments</h1>
            <AdminWidgetAssignmentPanel
                tenantId={Number(params.tenantId)}
                allWidgets={allWidgets}
                tenantWidgets={tenantWidgets}
            />
        </div>
    )
}