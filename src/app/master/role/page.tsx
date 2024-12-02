import TitlePage from "@/components/custom/page-heading";
import RoleList from "./List";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";
import { fetchRoles } from "@/app/action/role.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";


export default async function Page() {
  const roles = await fetchRoles().then((d)=>d.json());
  
  const session = await auth();
  const moduleId = session && findModuleId( session?.user.modules, "Role") as string;

  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Role" description="List of all roles" listPage moduleId={moduleId}/>
      {
        roles.success 
        ? roles.data && roles.data.length > 0
        ? <RoleList data={roles.data} /> 
        : <NoRecordPage text={"module"} />
        : <SomethingWentWrong message={roles.message} />
      }
    </div>
  );
}