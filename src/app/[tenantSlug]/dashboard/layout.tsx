import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get you overview",
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      {children}
    </>
  );
}