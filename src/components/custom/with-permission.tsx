"use client";
import { ReactNode } from "react";
import { hasPermission } from "@/utils/guard";
import Loading from "@/app/loading";
import AccessDenied from "./access-denied";
import { usePermission } from "@/hooks/use-permissions";

interface WithPermissionProps {
  permissionBit: number;
  children: ReactNode;
}

export const WithPermission = ({ children, permissionBit }: WithPermissionProps) => {
  const { rolePermission, status } = usePermission();
  const permission = hasPermission(rolePermission, permissionBit)

  if (status === 'loading') {
    return <Loading/>
  }

  if (!permission) {
    return (<AccessDenied/>)
  }

  return children;
};