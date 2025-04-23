import { fetchUniqueModule } from "@/app/action/module.action";
import { getAllGroups } from "@/app/action/group.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import TitlePage from "@/components/custom/page-heading";
import { IGroup } from "@/app/_Interface/Group";
import ModuleForm from "../ModuleForm";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const module = await fetchUniqueModule(id).then((d) => d.json());
    const groups = await getAllGroups();

    const isModule = module && module.success
    const isGroup = groups && groups.success

    const modules = module.data || [];
    const groupOptions = isGroup && groups?.data?.map((item: IGroup) => ({ label: item.name, value: item.id }));

    return (isModule && isGroup && groupOptions ? (
      <ModuleForm groupOptions={groupOptions} id={id} modules={modules} />
    ) : (
      <SomethingWentWrong message={isModule ? groups.message : module.message} />
    ));
  } catch (error) {
    return (
      <>
        <TitlePage title="Module" description={"Overview module and submodule"} viewPage />
        <SomethingWentWrong message={error instanceof Error ? error.message : "An unexpected error occurred."} />
      </>
    )
  }
}