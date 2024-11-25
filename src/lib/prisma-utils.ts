import prisma from "./prisma";

interface FormattedModule {
  id: string;
  name: string;
  parentId: string | null;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
  subModules: FormattedModule[];
}

export async function getModulesWithSubmodules(): Promise<FormattedModule[]> {
  try {
    const modules = await prisma.module.findMany({
      include: {
        modulePermissions: true,
        subModules: {
          include: {
            subModulePermissions: true,
            subModules: {
              include: {
                subModulePermissions: true,
                subModules: {
                  include: {
                    subModulePermissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedModules = formatModules(modules as any);
    // console.log(JSON.stringify(formattedModules, null, 2));

    return formattedModules;
  } catch (error) {
    console.error('Error fetching modules with submodules:', error);
    throw new Error('Failed to fetch modules with submodules');
  }
}

interface ModulePermission {
  id: string;
  moduleId: string;
  roleId: string;
  subModuleId: string | null;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
}

interface Module {
  id: string;
  name: string;
  parentId: string | null;
  modulePermissions: ModulePermission[];
  subModules: Module[];
}

function formatModules(modules: Module[]): FormattedModule[] {
  const formattedModulesMap: Map<string, FormattedModule> = new Map();

  // First, we convert the modules into the desired format and store them in a map
  modules.forEach((module) => {
    const modulePermissions = module.modulePermissions.reduce(
      (acc, permission) => {
        acc.canCreate ||= permission.canCreate;
        acc.canRead ||= permission.canRead;
        acc.canUpdate ||= permission.canUpdate;
        acc.canDelete ||= permission.canDelete;
        acc.canManage ||= permission.canManage;
        return acc;
      },
      {
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canManage: false,
      }
    );

    const formattedModule: FormattedModule = {
      id: module.id,
      name: module.name,
      parentId: module.parentId,
      canCreate: modulePermissions.canCreate,
      canRead: modulePermissions.canRead,
      canUpdate: modulePermissions.canUpdate,
      canDelete: modulePermissions.canDelete,
      canManage: modulePermissions.canManage,
      subModules: [],
    };

    formattedModulesMap.set(module.id, formattedModule);
  });

  // Now, we link sub-modules to their parent modules
  modules.forEach((module) => {
    if (module.subModules.length > 0) {
      module.subModules.forEach((subModule) => {
        const parentModule = formattedModulesMap.get(module.id);
        const subModuleFormatted = formattedModulesMap.get(subModule.id);
        if (parentModule && subModuleFormatted) {
          parentModule.subModules.push(subModuleFormatted);
        }
      });
    }
  });

  // Return the top-level modules (those with no parentId)
  return Array.from(formattedModulesMap.values()).filter(
    (module) => module.parentId === null
  );
}