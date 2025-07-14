import { getTenantRoles, getTenantWidgetsWithAssignments } from '@/app/actions/widgets'
import TitlePage from '@/components/custom/page-heading'
import { WidgetRoleAssignmentPanel } from '@/components/tenant-admin/widget-role-assignment-panel'

export const metadata = {
    title: "Widget Assignment",
    description: "Manage widget assignments for the selected role",
};

export default async function WidgetAssignmentPage({ params }: { params: { tenantSlug: string } }) {
    const [widgets, roles] = await Promise.all([
        getTenantWidgetsWithAssignments(params.tenantSlug),
        getTenantRoles(params.tenantSlug)
    ])

    return (
        <>
            <TitlePage {...metadata} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="container mx-auto p-6">
                    <WidgetRoleAssignmentPanel
                        widgets={widgets}
                        roles={roles}
                        tenantSlug={params.tenantSlug}
                    />
                </div>
            </div>
        </>
    )
}