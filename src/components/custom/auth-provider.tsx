"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ChildProps } from "@/types/types";
import { Session } from "next-auth";

interface NextAuthProviderProps extends ChildProps {
  session?: Session | null;
}

export const NextAuthProvider = ({ children, session }:NextAuthProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};