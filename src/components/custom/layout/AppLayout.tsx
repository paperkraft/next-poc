'use client'
import React from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import LeftSidebar from "./LeftSidebar";

const publicURL = ['/signin', '/signup'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicURL = publicURL.includes(pathname);

  useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && redirect('/signin')
    }
  });

  if(isPublicURL){
    return children
  } else {
    return <LeftSidebar>{children}</LeftSidebar>
  }
}