import prisma from "@/lib/prisma";
import TitlePage from "@/components/custom/page-heading";
import ModuleList from "./ModuleList";
import { IModule } from "./ModuleInterface";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";

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

async function fetchModules() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        group: true,
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
    console.error("Error fetching modules:", error);
    return null;
  }
}

// Recursive function to process a module and its submodules
function formatModule(module: InputFormat): IModule {
  return {
    id: module.id,
    name: module.name,
    group: module.group?.name,
    parentId: module?.parentId,
    permissions: null,
    subModules: (module.subModules || []).map((subModule) => formatModule(subModule)),
  };
}

export default async function Page() {
  const modules = await fetchModules();
  const session = await auth();
  const moduleId = findModuleId( session?.user.modules, "Role") as string;
  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Module List" description="List of all module and submodule" listPage moduleId={moduleId}/>
      {modules && modules.length > 0 ? (
        <ModuleList data={modules} />
      ) : (
        <NoRecordPage text={"module"} />
      )}
    </div>
  )
}