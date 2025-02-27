import EditModule from "./EditModule";
import { fetchUniqueModule } from "@/app/action/module.action";
import { fetchGroups } from "@/app/action/group.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import TitlePage from "@/components/custom/page-heading";
import { IGroup } from "@/app/_Interface/Group";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";
import { auth } from "@/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  if (!permission) {
    return <AccessDenied />;
  }

  try {
    const module = await fetchUniqueModule(id).then((d)=>d.json());
    const isModule = module && module.success
    
    const groups = await fetchGroups().then((d)=> d.json());
    const isGroup = groups && groups.success
    const groupOptions = isGroup && groups?.data?.map((item: IGroup) => ({ label: item.name, value: item.id }));
  
    return (isModule && isGroup ? (
      <EditModule moduleData={module.data} groupOptions={groupOptions} />
    ) : (
      <SomethingWentWrong message={isModule ? groups.message : module.message} />
    ));
  } catch (error) {
    return(
      <>
        <TitlePage title="Module" description={"Overview module and submodule"} viewPage/>
        <SomethingWentWrong message={error instanceof Error ? error.message : "An unexpected error occurred."} />
      </>
    )
  }
}