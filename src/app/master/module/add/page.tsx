import TitlePage from "@/components/custom/page-heading";
import AddModule from "./AddModule";
import { fetchModules } from "@/app/action/module.action";
import { fetchGroups } from "@/app/action/group.action";
import NoRecordPage from "@/components/custom/no-record";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { IGroup } from "@/app/_Interface/Group";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";
import AddModuleForm from "./AddModuleForm";

export default async function AddModulePage() {
  try {
    const moduleResponse = await fetchModules().then((d) => d.json());
    const groupsResponse = await fetchGroups().then((d) => d.json());
    const groupOptions = groupsResponse?.data?.map((item: IGroup) => ({ label: item.name, value: item.id }));

    const session = await auth();
    const rolePermissions = +session?.user?.permissions;
    const permission = hasPermission(rolePermissions, 8);
  
    // if (!permission) {
    //   return <AccessDenied />;
    // }

    return (
      <>
        <TitlePage title="Create Module" description="Define a new module" createPage />
        {moduleResponse.success && groupsResponse.success
          ? moduleResponse.data.length > 0 && groupsResponse.data.length > 0
            // ? <AddModule modules={moduleResponse.data} groups={groupOptions} />
            ? <AddModuleForm groups={groupOptions}/>
            : <NoRecordPage text={moduleResponse.data.length > 0 ? "group" : "module"} />
          : <SomethingWentWrong message={moduleResponse.success ? groupsResponse.message : moduleResponse.message} />
        }
      </>
    );

  } catch (error) {
    return (
      <>
        <TitlePage title="Create Module" description="Define a new module" createPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}