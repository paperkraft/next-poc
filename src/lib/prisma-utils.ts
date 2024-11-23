import prisma from "./prisma";

interface FormattedModule {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  submodules: FormattedModule[];
}

type InputFormat = {
  moduleId: string;
  submoduleId: string | null;
  permissions: number;
  module: {
      id: string;
      name: string;
      parentId: string | null;
  };
  submodule: {
      id: string;
      name: string;
      parentId: string | null;
      SubModules: any[];
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
  const roleWithModules = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      ModulePermissions: {
        include: {
          module: true,
          submodule: {
            include: {
              SubModules: true
            }
          }
        }
      }
    },
  });
  return roleWithModules && formatModules(roleWithModules?.ModulePermissions);
}

function formatModules(data: InputFormat[]): FormattedModule[] {
  const moduleMap: Record<string, FormattedModule> = {};
  data && data?.forEach((item) => {
    const { moduleId, permissions, module, submodule } = item;

    // Create or update the module
    if (!moduleMap[moduleId]) {
      moduleMap[moduleId] = {
        id: moduleId,
        name: module.name,
        parentId: module.parentId,
        permissions: 0,
        submodules: [],
      };
    }

    // Add the permission of the current item to the module
    moduleMap[moduleId].permissions |= permissions;

    // If there is a submodule, handle it separately
    if (submodule && submodule.id) {
      const submoduleId = submodule.id;
      const submoduleData: FormattedModule = {
        id: submoduleId,
        name: submodule.name,
        parentId: submodule.parentId,
        permissions: permissions,
        submodules: [],
      };

      // Handle SubModules (nested submodules)
      if (submodule.SubModules && submodule.SubModules.length > 0) {
        submoduleData.submodules = submodule.SubModules.map((childSubmodule) => ({
          id: childSubmodule.id,
          name: childSubmodule.name,
          parentId: childSubmodule.parentId,
          permissions: permissions,
          submodules: [],
        }));
      }

      // Push the submodule to the corresponding module
      moduleMap[moduleId].submodules.push(submoduleData);
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
      submodules: (module.SubModules || []).map((submodule: any) => formatModule(submodule)),
    };
  }

  try {
    const modules = await prisma.module.findMany({
      include: {
        permissions: true,
        SubModules: {
          include: {
            permissions: true,
            SubModules: {
              include: {
                permissions: true,
                SubModules: {
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
    const submoduleIds = new Set(formattedModules.flatMap((module) => module.submodules.map((submodule) => submodule.id)));
    const finalModules = formattedModules.filter((module) => !submoduleIds.has(module.id));
    return finalModules;
  } catch (error) {
    console.error('Error fetching modules with submodules:', error);
    throw new Error('Failed to fetch modules with submodules');
  }
}