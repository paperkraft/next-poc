"use client";
import React from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import AppSidebar from "./AppSidebar";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";

export const publicURL = ["/signin", "/signup"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);
  
  useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.push("/");
    }
  })

  const { data, status } = useSession();

  if(status === 'loading'){
    return <Loading/>
  }
  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return <>{children}</>;
  }
  return data && <AppSidebar>{children}</AppSidebar>;
}