import prisma from "@/lib/prisma";
import EditModule from "./EditModule";
import { IModule } from "../ModuleInterface";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const module = await prisma.module.findUnique({
    where: { id: id },
    select: {
      id: true,
      name:true,
      group: true,
      parent:true,
      parentId:true,
      permissions: true,
      subModules: {
        select: {
          id: true,
          name:true,
          parent:true,
          parentId:true,
          permissions: true,
          subModules: {
            select: {
              id: true,
              name:true,
              parent:true,
              parentId:true,
              permissions: true,
              subModules: {
                select: {
                  id: true,
                  name:true,
                  parent:true,
                  parentId:true,
                  permissions: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const formattedModules =  module && formatModule(module);

  if (!module || !formattedModules) {
    return <>No module found</>;
  }
  return formattedModules && <EditModule data={formattedModules} />;
}


function formatModule(module: any): IModule {
  return {
    id: module.id,
    name: module.name,
    group: module.group.id,
    parentId: module?.parentId,
    permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
    subModules: (module.subModules || []).map((subModule: any) => formatModule(subModule)),
  };
}