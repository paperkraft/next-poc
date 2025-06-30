import { auth } from "@/auth";
import Content from "@/components/common/ContentLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserModules } from "@/lib/menus";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const session = await auth();

    if (!session || !session?.user?.globalRoles?.includes('SYSTEM_ADMIN')) {
        redirect('/access-denied')
    }

    const menus = await getUserModules(session?.user.tenantId, session?.user.roleId);

    return (
        <SidebarProvider>
            <Content menus={menus}>
                {children}
            </Content>
        </SidebarProvider>
    )
}