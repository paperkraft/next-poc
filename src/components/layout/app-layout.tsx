"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./Sidebar/app-sidebar";
import { useSession } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";
import { SidebarProvider } from "../ui/sidebar";
import { NotificationsProvider } from "@/context/notification-context";
import { ThemeWrapper } from "./theme-wrapper";

export const publicURL = ["/signin", "/signup"];

export default function AppLayout({ children, defaultOpen }: { children: React.ReactNode, defaultOpen: boolean }) {
  const route = useRouter();
  const mounted = useMounted();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);
  const { status } = useSession();

  useSession({
    required: true,
    onUnauthenticated() {
      mounted && !isPublicURL && route.push("/");
    },

  });

  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return mounted && <React.Fragment>{children}</React.Fragment>;
  }

  if (status === "authenticated") {
    return mounted && (
      <ThemeWrapper>
        <SidebarProvider>
          <NotificationsProvider>
            <AppSidebar>
              {children}
            </AppSidebar>
          </NotificationsProvider>
        </SidebarProvider>
      </ThemeWrapper>
    )
  }
}