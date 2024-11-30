import prisma from "@/lib/prisma";
import EditModule from "./EditModule";
import { IModule } from "../ModuleInterface";
import NoRecordPage from "@/components/custom/no-record";

export interface IOptions {
  label: string;
  value: string;
}
export interface IData {
  moduleData: IModule,
  groupOptions: IOptions[]
}

async function fetchUniqueModule(id: string) {
  try {
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
    return module && formatModule(module);
  } catch (error) {
    console.error("Error fetching module:", error);
    return null;
  }
}

async function fetchGrops() {
  try {
    const groupOptions = await prisma.group.findMany({
      select:{ id:true, name:true }
    });
    return groupOptions.map((item: any) => { return { label: item.name, value: item.id }});
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

function formatModule(module: any): IModule {
  return {
    id: module.id,
    name: module.name,
    group: module?.group?.id,
    parentId: module?.parentId,
    permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
    subModules: (module.subModules || []).map((subModule: any) => formatModule(subModule)),
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const module = await fetchUniqueModule(id);
  const groupOptions = await fetchGrops();

  return (module && groupOptions ? (
    <EditModule moduleData={module} groupOptions={groupOptions}   />
  ) : (
    <NoRecordPage text={"module"} />
  ));
}