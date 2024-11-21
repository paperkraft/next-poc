import prisma from "@/lib/prisma";
import ModuleList from "./ModuleList";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IModule } from "./ModuleInterface";

export default async function Page() {
  const modules = await getModulesWithSubmodules();

  if (!modules) {
    return null
  }

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
      {modules && <ModuleList data={modules} />}
    </div>
  )
}

export async function getModulesWithSubmodules(): Promise<IModule[]> {
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


// Recursive function to process a module and its submodules
function formatModule(module: any): IModule {
  return {
    id: module.id,
    name: module.name,
    parentId: module?.parentId,
    permissions: module.permissions.reduce((acc: number, perm: any) => acc | perm.bitmask, 0),
    submodules: (module.SubModules || []).map((submodule: any) => formatModule(submodule)),
  };
}