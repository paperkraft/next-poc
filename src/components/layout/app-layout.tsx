"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./Sidebar/app-sidebar";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { useMounted } from "@/hooks/use-mounted";

export const publicURL = ["/signin", "/signup"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();
  const isPublicURL = pathname && publicURL.includes(pathname);
  const { status } = useSession();
  const mount = useMounted();

  useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.push("/");
    },
  })

  React.useEffect(() => {
    if (status === "loading") return;
    if (!isPublicURL && status === "unauthenticated") {
      route.push("/");
    }
  }, [status, isPublicURL, route]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (status === "authenticated") {
    return (mount && <AppSidebar>{children}</AppSidebar>)
  }
}