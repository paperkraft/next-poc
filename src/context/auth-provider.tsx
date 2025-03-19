"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
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