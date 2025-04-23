import TitlePage from "@/components/custom/page-heading";
import NoRecordPage from "@/components/custom/no-record";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { IGroup } from "@/app/_Interface/Group";
import { getAllGroups } from "@/app/action/group.action";
import ModuleForm from "../ModuleForm";

export default async function AddModulePage() {
  try {
    const groupsResponse = await getAllGroups();
    const groupOptions = groupsResponse?.data?.map((item: IGroup) => ({ label: item.name, value: item.id }));

    return (
      <>
        {groupsResponse.success
          ? groupOptions && groupOptions?.length > 0
            ? <ModuleForm groupOptions={groupOptions} />
            : <NoRecordPage text={"group"} />
          : <SomethingWentWrong message={groupsResponse.message} />
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