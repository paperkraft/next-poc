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

      if (module.submodules && module.submodules.length > 0) {
        const submoduleId = findModuleId(module.submodules);
        if (submoduleId) return submoduleId;
      }
    }
    return null;
  };
  return findModuleId(session && session.user.modules);
};

export default useModuleIdByName;
