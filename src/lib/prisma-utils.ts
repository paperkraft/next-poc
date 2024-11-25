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
    console.log(JSON.stringify(formattedModules, null, 2));

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

interface TCreate{
  name:string;
  createdBy: string | null;
}

interface TUpdate extends TCreate{
  id:string;
  updatedBy: string | null;
}

export async function CreateRole (data:TCreate){
  const { name, createdBy } = data;
  const newRole = await prisma.role.create({
    data: { name, createdBy }
  });
  return newRole
}

export async function UpdateRole (data:TUpdate){
  const { id, name, updatedBy } = data;
  const newRole = await prisma.role.update({
    where: { id: id },
    data: { name, updatedBy }
  });
  return newRole
}


export async function CreateModule (data:TCreate){
  const { name, createdBy } = data;
  const newModule = await prisma.module.create({
    data: { name, createdBy }
  });
  return newModule
}

interface IModulePermission{
  moduleId: string;
  roleId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  createdBy: string | null;
}


export async function ModulePermission (data:IModulePermission){
  const newPermission = await prisma.modulePermission.create({
    data: {
      moduleId: data.moduleId,
      roleId: data.roleId,
      canCreate: data.canCreate,
      canRead: data.canRead,
      canUpdate: data.canUpdate,
      canDelete: data.canDelete,
      createdBy: data.createdBy,
    },
  });
  
  return newPermission
}