import { auth } from "@/auth";
import Content from "@/components/common/ContentLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserModules } from "@/lib/menus";
import { getTenantsForAdmin } from "@/lib/tenants";
import { redirect } from "next/navigation";

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {

    const session = await auth();

    if (!session || !session?.user?.globalRoles?.includes('SYSTEM_ADMIN')) {
        redirect('/access-denied')
    }

    const menus = await getUserModules(session?.user.tenantId, session?.user.roleId);
    const tenants = await getTenantsForAdmin();

    return (
        <SidebarProvider>
            <Content menus={menus} tenants={tenants}>
                {children}
            </Content>
        </SidebarProvider>
    )
}