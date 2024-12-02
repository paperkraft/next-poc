import SomethingWentWrong from "@/components/custom/somthing-wrong";
import EditGroup from "./EditGroup";
import { fetchUniqueGroup } from "@/app/action/group.action";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const role = await fetchUniqueGroup(id).then((d)=>d.json());

  return (role.success ? (
    <EditGroup data={role.data} />
  ) : (
    <SomethingWentWrong message={role.message} />
  ));
  // return <EditGroup id={id} />
}