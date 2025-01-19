import TitlePage from "@/components/custom/page-heading";
import ModuleMasterList from "./ModuleList";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";
import { fetchModules } from "@/app/action/module.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export default async function ModuleMasterPage() {
  try {
    const session = await auth();
    const moduleId = session && findModuleId(session?.user?.modules, "Module");
    const response = await fetchModules().then((d) => d.json());

    return (
      <>
        <TitlePage title="Module List" description="List of all module and submodule" listPage moduleId={moduleId} />
        {response.success
          ? response.data.length === 0
            ? <NoRecordPage text="module" />
            : <ModuleMasterList data={response.data} moduleId={moduleId as string} />
          : <SomethingWentWrong message={response.message} />
        }
      </>
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