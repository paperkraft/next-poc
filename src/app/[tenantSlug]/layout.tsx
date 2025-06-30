import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ContentLayout from '@/components/common/ContentLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TenantProvider } from '@/context/TenantProvider';
import { getUserModules } from '@/lib/menus';
import { validateTenantAccess } from '@/lib/tenants';

type TenantLayoutProps = {
    children: React.ReactNode,
    params: {
        tenantSlug: string
    }
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
    // Validate tenant access
    const session = await auth();

    if (!session) {
        redirect('/signin')
    }

    const { isValid, redirectPath, tenant } = await validateTenantAccess(params.tenantSlug);

    if (!isValid && redirectPath) {
        redirect(redirectPath)
    }

    const userMenus = await getUserModules(session.user?.tenantId, session.user?.roleId);

    return (
        <TenantProvider tenant={tenant} menus={userMenus}>
            <SidebarProvider>
                <ContentLayout tenant={tenant} menus={userMenus}>
                    {children}
                </ContentLayout>
            </SidebarProvider>
        </TenantProvider>
    )
}