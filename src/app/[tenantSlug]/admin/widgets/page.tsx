import { getTenantRoles, getTenantWidgetsWithAssignments } from '@/app/actions/widgets'
import { WidgetRoleAssignmentPanel } from '@/components/tenant-admin/widget-role-assignment-panel'

export default async function WidgetAssignmentPage({
    params
}: {
    params: { tenantSlug: string }
}) {
    const [widgets, roles] = await Promise.all([
        getTenantWidgetsWithAssignments(params.tenantSlug),
        getTenantRoles(params.tenantSlug)
    ])

    return (
        <div className="container mx-auto p-6">
            <WidgetRoleAssignmentPanel
                initialWidgets={widgets}
                initialRoles={roles}
                tenantSlug={params.tenantSlug}
            />
        </div>
    )
}