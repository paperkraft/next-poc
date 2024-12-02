import TitlePage from "@/components/custom/page-heading";
import ModuleList from "./ModuleList";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";
import { fetchModules } from "@/app/action/module.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
 
export default async function Page() {
  const modules = await fetchModules().then((d)=> d.json());

  const session = await auth();
  const moduleId = session && findModuleId( session?.user.modules, "Role") as string;
  
  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Module List" description="List of all module and submodule" listPage moduleId={moduleId}/>
      {
        modules.success 
        ? modules.data && modules.data.length > 0
        ? <ModuleList data={modules.data} /> 
        : <NoRecordPage text={"module"} />
        : <SomethingWentWrong message={modules.message} />
      }
    </div>
  )
}