import prisma from "@/lib/prisma";
import ModuleList from "./ModuleList";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IModuleFormat } from "./ModuleInterface";


interface InputFormat {
  id: string,
  name: string,
  group: string | null;
  parentId: string | null,
  SubModules: InputFormat[] | null
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
        SubModules: {
          include: {
            SubModules: {
              include: {
                SubModules: true,
              },
            },
          },
        },
      },
    });

    const formattedModules = modules.map((module) => formatModule(module as any));
    const submoduleIds = new Set(formattedModules.flatMap((module) => module.submodules.map((submodule) => submodule.id)));
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
  group: string | null;
  parentId: string | null;
  submodules: Module[]
}
// Recursive function to process a module and its submodules
function formatModule(module: InputFormat): Module {
  return {
    id: module.id,
    name: module.name,
    group: module.group,
    parentId: module?.parentId,
    submodules: (module.SubModules || []).map((submodule) => formatModule(submodule)),
  };
}