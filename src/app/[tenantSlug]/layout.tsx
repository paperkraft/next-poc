import { auth } from '@/auth';
import { TenantProvider } from '@/context/TenantProvider'
import { validateTenantAccess } from '@/lib/tenants'
import { getUserModules } from '@/lib/menus';
import { redirect } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar';
import Content from '@/components/common/Content';


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

    const isAdmin = !!session.user.globalRoles?.includes('SYSTEM_ADMIN');

    const { isValid, redirectPath, tenant } = await validateTenantAccess(params.tenantSlug);

    if (!isValid && redirectPath) {
        redirect(redirectPath)
    }

    // const tenant = await getTenantBySlug(params.tenantSlug);
    const userMenus = await getUserModules(session?.user.tenantId, session?.user.roleId);
    console.log('userMenus', userMenus);

    return (
        <>
            <TenantProvider tenant={tenant} menus={userMenus}>
                <SidebarProvider>
                    <Content isAdmin={isAdmin}>
                        {children}
                    </Content>
                </SidebarProvider>
            </TenantProvider>

        </>
    )
}