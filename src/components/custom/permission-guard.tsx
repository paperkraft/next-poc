"use client";
import { ReactNode } from "react";
import { menusConfig } from "@/hooks/use-config";
import { IModule } from "@/app/_Interface/Module";

interface GuardProps {
  permissionBit: number;
  moduleId: string;
  children: ReactNode;
}
 
export const Guard = ({ children, permissionBit, moduleId }: GuardProps) => {
  const [serverMenu] = menusConfig();

  const hasPermissionForModule = serverMenu?.some((module: IModule) => {
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