"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./Sidebar/app-sidebar";
import { useSession } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";
import { SidebarProvider } from "../ui/sidebar";
import { NotificationsProvider } from "@/context/notification-context";
import { publicURL } from "@/constants/routes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const mounted = useMounted();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.replace("/");
    },
  });

  if (!mounted) return null;

  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (status === "authenticated") {
    return (
      <SidebarProvider>
        <NotificationsProvider>
          <AppSidebar>
            {children}
          </AppSidebar>
        </NotificationsProvider>
      </SidebarProvider>
    )
  }
}