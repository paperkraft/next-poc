import Content from "@/components/common/Content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Content>
                {children}
            </Content>
        </SidebarProvider>
    )
}