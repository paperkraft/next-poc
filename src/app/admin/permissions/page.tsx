import { Metadata } from 'next';

import { fetchRoles } from '@/app/actions/role.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can, canAny } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';

import RolePermissionsPage from './RolePermissionManager';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role based module access",
};

export default async function RBAC() {

    const headersList = headers();
    const currentPath = headersList.get('x-current-path') || '';

    try {
        const { session, modules } = await getSessionModules();

        if (!session) return <AccessDenied />;

        const hasPermission = can({
            action: "READ",
            path: currentPath,
            modules,
        });

        if (!hasPermission) return <AccessDenied />;

        const res = await fetchRoles();

        return (
            <div className="space-y-4 p-2">
                <TitlePage
                    title="Role Based Access Control"
                    description="Define role based module access"
                    createPage
                />

                {res.success ? (
                    res.data && res.data.length > 0
                        ? <RolePermissionsPage roles={res.data} />
                        : <NoRecordPage text="role" />
                ) : (
                    <SomethingWentWrong message={res.message} />
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching session:", error);
        // Handle the error gracefully and return a fallback UI
        return (
            <>
                <TitlePage
                    title="Role Based Access Control"
                    description="Define role based module access"
                    createPage
                />
                <SomethingWentWrong message="An unexpected error occurred." />
            </>
        );

    }
}