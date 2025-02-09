"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./Sidebar/app-sidebar";
import { useSession } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";

export const publicURL = ["/signin", "/signup"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
    return mounted && (<AppSidebar>{children}</AppSidebar>)
  }
}