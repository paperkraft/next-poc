'use client'
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import LeftSidebar from "./LeftSidebar";
import { useSession } from "next-auth/react";

export const publicURL = ['/signin', '/signup'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);

  const { data: session } = useSession();
  const user = session?.user;

  useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.push('/')
    }
  });

  if (isPublicURL || (pathname === "/" && !user)) {
    return <React.Fragment>{children}</React.Fragment>
  } else {
    return <LeftSidebar>{children}</LeftSidebar>
  }
}