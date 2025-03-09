"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";
import { AuthProvider } from "./auth-context";

interface NextAuthProviderProps {
  children: ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  const mounted = useMounted();
  if (!mounted) return null
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  )
};