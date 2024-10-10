"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ChildProps } from "@/types/children";

export const NextAuthProvider = ({ children }:ChildProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};