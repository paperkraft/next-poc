"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./AppSidebar";
import { useSession } from "next-auth/react";

export const publicURL = ["/signin", "/signup"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);

  const { data: session, status } = useSession();

  useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.push("/");
    }
  });

  if (isPublicURL || (pathname === "/" && status === "unauthenticated")) {
    return <>{children}</>;
  } else {
    return session && <AppSidebar>{children}</AppSidebar>;
  }
}
