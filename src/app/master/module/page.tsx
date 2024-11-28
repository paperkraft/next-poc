import prisma from "@/lib/prisma";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ModuleList } from "./ModuleList";

interface IGroup {
  id: string,
  name: string,
}

interface InputFormat {
  id: string,
  name: string,
  group: IGroup | null;
  parentId: string | null,
  subModules: InputFormat[] | null
}

export default async function Page() {

  try {
    const modules = await getModulesWithSubmodules();

    return (
      <div className="space-y-8 p-2">
        <TitlePage title="Module List" description="List of all module and submodule">
          <div className="flex gap-2">
            <Button className="size-7" variant={"outline"} size={"sm"} asChild>
              <Link href={'/master/module/add'}>
                <Plus className="size-5" />
              </Link>
            </Button>
          </div>
        </TitlePage>
        {!modules && <>No data found...</>}
        {modules && <ModuleList data={modules as any} />}
      </div>
    )
  } catch (error) {
    console.error(error);
    return <>Failed to fetch data...</>
  }
}

export async function getModulesWithSubmodules(): Promise<Module[]> {
  try {
    // 3 level submodules
    const modules = await prisma.module.findMany({
      include: {
        group:true,
        subModules: {
          include: {
            subModules: {
              include: {
                subModules: true,
              },
            },
          },
        },
      },
    });

    const formattedModules = modules.map((module) => formatModule(module as any));
    const submoduleIds = new Set(formattedModules.flatMap((module) => module.subModules.map((subModule) => subModule.id)));
    const finalModules = formattedModules.filter((module) => !submoduleIds.has(module.id));

    return finalModules;
  } catch (error) {
    console.error('Error fetching modules with submodules:', error);
    throw new Error('Failed to fetch modules with submodules');
  }
}


interface Module {
  id: string;
  name: string;
  group: string | undefined | null;
  parentId: string | null;
  subModules: Module[]
}
// Recursive function to process a module and its submodules
function formatModule(module: InputFormat): Module {
  return {
    id: module.id,
    name: module.name,
    group: module.group?.name,
    parentId: module?.parentId,
    subModules: (module.subModules || []).map((subModule) => formatModule(subModule)),
  };
}