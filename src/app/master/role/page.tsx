import { auth } from "@/auth";
import TitlePage from "@/components/custom/page-heading";
import NoRecordPage from "@/components/custom/no-record";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { findModuleId } from "@/utils/helper";
import { fetchRoles } from "@/app/action/role.action";
import RoleList from "./RoleMasterList";

export default async function RoleMasterPage() {
  try {
    const session = await auth();
    const moduleId = session && findModuleId(session?.user?.modules, "Role");
    const response = await fetchRoles().then((d) => d.json());

    return (
      <>
        <TitlePage title="Role" description="List of all roles" listPage moduleId={moduleId} />
        {response.success
          ? response.data.length === 0
            ? <NoRecordPage text="role" />
            : <RoleList data={response.data} moduleId={moduleId as string} />
          : <SomethingWentWrong message={response.message} />
        }
      </>
    );
  } catch (error) {
    return (
      <>
        <TitlePage title="Role" description="List of all roles" listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}