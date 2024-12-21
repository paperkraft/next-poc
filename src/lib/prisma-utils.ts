import prisma from "./prisma";

interface FormattedModule {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  subModules: FormattedModule[];
}

type InputFormat = {
  moduleId: string;
  subModuleId: string | null;
  permissions: number;
  module: {
      id: string;
      name: string;
      parentId: string | null;
  };
  subModule: {
      id: string;
      name: string;
      parentId: string | null;
      subModules: any[];
  } | null;
};

export const createPermissions = async () => {
  await prisma.permission.createMany({
    data: [
      { name: "VIEW", bitmask: 1 },
      { name: "EDIT", bitmask: 2 },
      { name: "CREATE", bitmask: 4 },
      { name: "DELETE", bitmask: 8 },
    ],
  });
};

 
export const getModulesByRole = async (roleId: string): Promise<FormattedModule[] | null> => {

  try {
    const roleWithModules = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        modulePermissions: {
          include: {
            module: true,
            subModule: {
              include: {
                subModules: true
              }
            }
          }
        }
      },
    });
    return roleWithModules && formatModules(roleWithModules?.modulePermissions);
  } catch (error) {
    console.error('Error fetching modules with submodules:', error);
    throw new Error('Failed to fetch modules with submodules');
  }
}

function formatModules(data: InputFormat[]): FormattedModule[] {
  const moduleMap: Record<string, FormattedModule> = {};
  data && data?.forEach((item) => {
    const { moduleId, permissions, module, subModule } = item;

    // Create or update the module
    if (!moduleMap[moduleId]) {
      moduleMap[moduleId] = {
        id: moduleId,
        name: module.name,
        parentId: module.parentId,
        permissions: 0,
        subModules: [],
      };
    }

    // Add the permission of the current item to the module
    moduleMap[moduleId].permissions |= permissions;

    // If there is a submodule, handle it separately
    if (subModule && subModule.id) {
      const subModuleId = subModule.id;
      const subModuleData: FormattedModule = {
        id: subModuleId,
        name: subModule.name,
        parentId: subModule.parentId,
        permissions: permissions,
        subModules: [],
      };

      // Handle SubModules (nested submodules)
      if (subModule.subModules && subModule.subModules.length > 0) {
        subModuleData.subModules = subModule.subModules.map((childSubmodule) => ({
          id: childSubmodule.id,
          name: childSubmodule.name,
          parentId: childSubmodule.parentId,
          permissions: permissions,
          subModules: [],
        }));
      }

      // Push the submodule to the corresponding module
      moduleMap[moduleId].subModules.push(subModuleData);
    }
  });
  return Object.values(moduleMap);
}

export async function getModulesWithSubmodules(): Promise<FormattedModule[]> {
  // Recursive function to process a module and its submodules
  function formatModule(module: any): FormattedModule {
    return {
      id: module.id,
      name: module.name,
      parentId: module?.parentId,
      permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
      subModules: (module.subModules || []).map((submodule: any) => formatModule(submodule)),
    };
  }

  try {
    const modules = await prisma.module.findMany({
      include: {
        permissions: true,
        subModules: {
          include: {
            permissions: true,
            subModules: {
              include: {
                permissions: true,
                subModules: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const formattedModules = modules.map((module) => formatModule(module));
    const submoduleIds = new Set(formattedModules.flatMap((module) => module.subModules.map((submodule) => submodule.id)));
    const finalModules = formattedModules.filter((module) => !submoduleIds.has(module.id));
    return finalModules;
  } catch (error) {
    console.error('Error fetching modules with submodules:', error);
    throw new Error('Failed to fetch modules with submodules');
  }
}