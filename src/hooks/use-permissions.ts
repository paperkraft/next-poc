"use client"
import { useSession } from "next-auth/react";

export function usePermission() {
  const { data, status } = useSession();
  const rolePermission:number = data && data.user.permissions;
  return { rolePermission, status };
}