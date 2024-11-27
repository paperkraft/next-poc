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
      SubModules: {
        select: {
          id: true,
          name:true,
          parent:true,
          parentId:true,
          permissions: true,
          SubModules: {
            select: {
              id: true,
              name:true,
              parent:true,
              parentId:true,
              permissions: true,
              SubModules: {
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

  function formatModule(module: any): IModule {
    return {
      id: module.id,
      name: module.name,
      group: module.group,
      parentId: module?.parentId,
      permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
      submodules: (module.SubModules || []).map((submodule: any) => formatModule(submodule)),
    };
  }

  const formattedModules =  module && formatModule(module)

  if (!module || !formattedModules) {
    return <>No module found</>;
  }
  return formattedModules && <EditModule data={formattedModules} />;
}
