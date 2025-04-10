import TitlePage from "@/components/custom/page-heading";
import ModuleMasterList from "./ModuleList";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";
import { fetchModules } from "@/app/action/module.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";

export default async function ModuleMasterPage() {
  try {
    const session = await auth();
    const moduleId = session && findModuleId(session?.user?.modules, "Module");
    const response = await fetchModules().then((d) => d.json());

    const rolePermissions = +session?.user?.permissions;
    const permission = hasPermission(rolePermissions, 8);
  
    return (
      <div className="space-y-2">
        <TitlePage title="Module List" description="List of all module and submodule" listPage moduleId={moduleId} />
        {response.success
          ? response.data.length === 0
            ? <NoRecordPage text="module" />
            : <ModuleMasterList data={response.data} moduleId={moduleId as string} />
          : <SomethingWentWrong message={response.message} />
        }
      </div>
    );

  } catch (error) {
    return (
      <>
        <TitlePage title="Module List" description="List of all module and submodule" listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}