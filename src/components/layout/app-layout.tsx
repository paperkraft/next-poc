"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./Sidebar/app-sidebar";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { NotificationsProvider } from "@/context/notification-context";

export const publicURL = ["/signin", "/signup"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);
  const { status } = useSession();

  useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.push("/");
    },
  })

  if (status === 'loading') {
    return <Loading />;
  }

  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (status === "authenticated") {
    return (<AppSidebar>{children}</AppSidebar>)
  }
}