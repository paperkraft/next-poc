import AppLayout from "@/components/custom/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get you overview",
};

export default function DashboardLayout({
  children,
  news,
  notification
}: Readonly<{
  children: React.ReactNode;
  news: React.ReactNode;
  notification: React.ReactNode;
}>) {
  return (
    <AppLayout>
      {children}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news}
        {notification}
      </div>
    </AppLayout>
  );
}
