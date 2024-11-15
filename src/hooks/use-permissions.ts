"use client"
import { useSession } from "next-auth/react";

export function usePermission() {
  const { data: session, status } = useSession();
  const rolePermission:number = session?.user?.permissions;

  return { rolePermission, status };
}