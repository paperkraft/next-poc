import RoleEdit from "./RoleEdit";
import { fetchUniqueRoles } from "@/app/action/role.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const role = await fetchUniqueRoles(id).then((d)=>d.json());

  return (role.success ? (
    <RoleEdit data={role.data} />
  ) : (
    <SomethingWentWrong message={role.message} />
  ));
}
