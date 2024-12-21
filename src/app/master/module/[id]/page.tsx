import EditModule from "./EditModule";
import { fetchUniqueModule } from "@/app/action/module.action";
import { fetchGroups } from "@/app/action/group.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const module = await fetchUniqueModule(id).then((d)=>d.json());
  const isModule = module && module.success
  
  const groups = await fetchGroups().then((d)=> d.json());
  const isGroup = groups && groups.success

  return (isModule && isGroup ? (
    <EditModule moduleData={module.data} groupOptions={groups.data}   />
  ) : (
    <SomethingWentWrong message={isModule ? groups.message : module.message} />
  ));
}