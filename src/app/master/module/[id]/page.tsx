import prisma from "@/lib/prisma";
import EditModule from "./EditModule";
import { IModule } from "../ModuleInterface";

export interface IOptions {
  label: string;
  value: string;
}
export interface IData {
  moduleData: IModule,
  groupOptions: IOptions[]
}

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

  const groupOptions = await prisma.group.findMany({
    select:{ id:true, name:true }
  });

  const formattedModules =  module && formatModule(module);

  if (!module || !formattedModules) {
    return <>No module found</>;
  }

  const data:IData = {
    moduleData: formattedModules,
    groupOptions: groupOptions.map((item: any) => { return { label: item.name, value: item.id }})
  }
  return formattedModules && <EditModule moduleData={data.moduleData} groupOptions={data.groupOptions} />;
}


function formatModule(module: any): IModule {
  return {
    id: module.id,
    name: module.name,
    group: module.group,
    parentId: module?.parentId,
    permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
    subModules: (module.subModules || []).map((subModule: any) => formatModule(subModule)),
  };
}