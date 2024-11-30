"use client";
import { ReactNode } from "react";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";

interface Module {
  id: string;
  name: string;
  permissions: number;
  subModules?: Module[];
}

interface WithPermissionProps {
  permissionBit: number;
  moduleId: string;
  children: ReactNode;
}

export const Guard = ({ children, permissionBit, moduleId }: WithPermissionProps) => {
  const { data: session, status } = useSession();

  const hasPermissionForModule = session?.user?.modules?.some((module: Module) => {
    const checkModulePermission = (module: Module): boolean => {
      if (module.id === moduleId) {
        return (module.permissions & permissionBit) === permissionBit;
      }

      if (module.subModules && module.subModules.length > 0) {
        return module.subModules.some(subModule => checkModulePermission(subModule));
      }
      return false;
    };

    return checkModulePermission(module);
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (!hasPermissionForModule) {
    return null
  }

  return <>{children}</>;
};