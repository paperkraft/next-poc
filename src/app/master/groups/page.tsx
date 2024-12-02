import TitlePage from "@/components/custom/page-heading";
import GroupList from "./GroupList";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";
import { fetchGroups } from "@/app/action/group.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";



export default async function Page() {
  const groups = await fetchGroups().then((d)=>d.json());
  
  const session = await auth();
  const moduleId = session && findModuleId(session?.user.modules, "Role");

  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Group" description="List of all groups, basically to catagorized menu" listPage moduleId={moduleId}/>
      {
        groups.success
        ? groups?.data && groups?.data?.length > 0
        ? <GroupList data={groups.data} />
        : <NoRecordPage text={"group"} />
        : <SomethingWentWrong message={groups.message} />
      }
    </div>
  );
}