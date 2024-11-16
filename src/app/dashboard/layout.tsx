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
    <>
      {children}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news}
        {notification}
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
    </>
  );
}
