import EditGroup from "./EditGroup";
import { fetchUniqueGroup } from "@/app/action/group.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const group = await fetchUniqueGroup(id).then((d)=>d.json());

  return (group.success ? (
    <EditGroup data={group.data} />
  ) : (
    <SomethingWentWrong message={group.message} />
  ));
}