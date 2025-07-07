import { getTenantRoles, getTenantWidgetsWithAssignments } from '@/app/actions/widgets'
import { WidgetAssignmentProvider } from '@/context/WidgetAssignmentContext'
import { WidgetAssignmentPanel } from './widget-assignment-panel'

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
            <WidgetAssignmentProvider
                initialWidgets={widgets}
                initialRoles={roles}
                tenantSlug={params.tenantSlug}
            >
                <WidgetAssignmentPanel />
            </WidgetAssignmentProvider>
        </div>
    )
}