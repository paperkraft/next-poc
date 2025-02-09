"use client";
import { ReactNode } from "react";
import { IModule } from "@/app/_Interface/Module";
import { useSession } from "next-auth/react";

interface GuardProps {
  permissionBit: number;
  moduleId: string;
  children: ReactNode;
}

export const Guard = ({ children, permissionBit, moduleId }: GuardProps) => {
  const { data } = useSession();
  const userMenus = data && data.user.modules;

  const hasPermissionForModule = userMenus?.some((module: IModule) => {
    const checkModulePermission = (module: IModule): boolean => {
      if (module.id === moduleId) {
        return (module.permissions! & permissionBit) === permissionBit;
      }

      if (module.subModules && module.subModules.length > 0) {
        return module.subModules.some(subModule => checkModulePermission(subModule));
      }
      return false;
    };

    return checkModulePermission(module);
  });

  if (!hasPermissionForModule) {
    return null
  }

  return children
};