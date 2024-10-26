'use client'
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "./AppSidebar";
import { useSession } from "next-auth/react";

export const publicURL = ['/signin', '/signup'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);

  const { status } = useSession();

  React.useEffect(() => {
    if (!isPublicURL && status === "unauthenticated") {
      route.push('/');
    }
  }, [isPublicURL, status, route]);

  if (isPublicURL || (pathname === "/" && status === 'unauthenticated' || status === 'loading')) {
    return <>{children}</>
  } else {
    return <AppSidebar>{children}</AppSidebar>
  }
}