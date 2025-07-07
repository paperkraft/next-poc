import { getTenantWidgets } from '@/app/actions/system-admin/widgets';
import { auth } from '@/auth';
import { SystemAdminWidgetAssignmentPanel } from '@/components/system-admin/widget-assignment-panel';

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
            <SystemAdminWidgetAssignmentPanel
                tenantId={Number(params.tenantId)}
                allWidgets={allWidgets}
                tenantWidgets={tenantWidgets}
            />
        </div>
    )
}