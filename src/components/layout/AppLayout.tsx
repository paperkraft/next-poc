"use client";
import React from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import AppSidebar from "./AppSidebar";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";

export const publicURL = ["/signin", "/signup", "/organization"];

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

  if(status === 'loading'){
    return <Loading/>
  }
  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return <>{children}</>;
  } else {
    return session && <AppSidebar>{children}</AppSidebar>;
  }
}
