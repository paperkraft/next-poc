import { getTenantRoles, getTenantWidgetsWithAssignments } from '@/app/action/widgets'
import { WidgetAssignmentPanel } from './WidgetAssignmentPanel'
import { WidgetAssignmentProvider } from '@/context/WidgetAssignmentContext'

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
            <h1 className="text-2xl font-bold mb-6">Widget Assignment</h1>
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