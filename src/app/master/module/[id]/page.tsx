import EditModule from "./EditModule";
import { fetchUniqueModule } from "@/app/action/module.action";
import { fetchGroups } from "@/app/action/group.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const module = await fetchUniqueModule(id).then((d)=>d.json());
  const groups = await fetchGroups().then((d)=> d.json());

  return (module.success && groups.success  ? (
    <EditModule moduleData={module.data} groupOptions={groups.data}   />
  ) : (
    <SomethingWentWrong message={module.success ? groups.message : module.message} />
  ));
}