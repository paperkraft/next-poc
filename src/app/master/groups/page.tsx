import { auth } from "@/auth";
import TitlePage from "@/components/custom/page-heading";
import NoRecordPage from "@/components/custom/no-record";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { findModuleId } from "@/utils/helper";
import { fetchGroups } from "@/app/action/group.action";
import GroupMasterList from "./GroupMasterList";

export default async function GroupPage() {
  try {
    const session = await auth();
    const moduleId = session && findModuleId(session?.user?.modules, "Groups");
    const response = await fetchGroups().then((d) => d.json());

    return (
      <>
        <TitlePage title="Groups" description="List of all groups, basically to catagorized menu" listPage moduleId={moduleId} />
        {response.success
          ? response.data.length === 0
            ? <NoRecordPage text="group" />
            : <GroupMasterList data={response.data} moduleId={moduleId as string} />
          : <SomethingWentWrong message={response.message} />
        }
      </>
    );
  } catch (error) {
    return (
      <>
        <TitlePage title="Groups" description="List of all groups, basically to catagorized menu" listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}