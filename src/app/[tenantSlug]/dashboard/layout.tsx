import { auth } from "@/auth";
import { DashboardProvider } from "@/components/provider/DashboardProvider";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardLayout from "./components/DashboardLayout";
import AllowNotification from "@/components/custom/allow-notification";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get you overview",
};

export default async function DashboardRootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: { tenantSlug: string } }>) {
  const session = await auth();
  if (!session) {
    redirect('/signin')
  }

  return (
    <>
      <DashboardProvider tenantSlug={params.tenantSlug} userId={+session.user.id}>
        <AllowNotification />
        {children}
        <div className="p-6">
          <DashboardLayout />
        </div>
      </DashboardProvider>
    </>
  );
}