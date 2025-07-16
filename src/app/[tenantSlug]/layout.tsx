import { redirect } from 'next/navigation';

import { getTenantsForAdmin, validateTenantAccess } from '@/lib/tenants';
import { auth } from '@/auth';
import { getUserModules } from '@/lib/menus';
import { TenantProvider } from '@/context/TenantProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import ContentLayout from '@/components/common/ContentLayout';

type TenantLayoutProps = {
    children: React.ReactNode,
    params: { tenantSlug: string }
}

export default async function TenantRootLayout({ children, params }: TenantLayoutProps) {
    // Validate tenant access
    const session = await auth();

    if (!session) {
        redirect('/signin')
    }

    const isSystem = session?.user?.globalRoles?.includes('SYSTEM_ADMIN');

    const { isValid, redirectPath, tenant } = await validateTenantAccess(params.tenantSlug);

    if (!isValid && redirectPath) {
        redirect(redirectPath)
    }

    const userMenus = await getUserModules(session.user?.tenantId, session.user?.roleId);
    const tenants = await getTenantsForAdmin();

    return (
        <>
            <TenantProvider currentTenant={tenant} tenants={tenants} menus={userMenus} isSystem={isSystem}>
                <SidebarProvider>
                    <ContentLayout>
                        {children}
                    </ContentLayout>
                </SidebarProvider>
            </TenantProvider>
        </>
    )
}