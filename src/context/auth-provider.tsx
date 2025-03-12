"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";
interface NextAuthProviderProps {
  children: ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
};