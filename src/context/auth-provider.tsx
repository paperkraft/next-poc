"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";
interface NextAuthProviderProps {
  children: ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  const mounted = useMounted();
  return (
    <SessionProvider>
      {mounted ? children : null}
    </SessionProvider>
  )
};