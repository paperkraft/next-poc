import { useSession } from "next-auth/react";

const useModuleIdByName = (moduleName: string): string | null => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session || !session.user || !session.user.modules) {
    console.warn("Session or modules not found");
    return null;
  }

  const findModuleId = (modules: any[]): string | null => {
    for (const module of modules) {
      if (module.name === moduleName) {
        return module.id;
      }

      if (module.subModules && module.subModules.length > 0) {
        const subModuleId = findModuleId(module.subModules);
        if (subModuleId) return subModuleId;
      }
    }
    return null;
  };
  return findModuleId(session && session.user.modules);
};

export default useModuleIdByName;
