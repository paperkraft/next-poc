import RoleEdit from "./RoleEdit";
import { fetchUniqueRoles } from "@/app/action/role.action";
import AccessDenied from "@/components/custom/access-denied";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { PermissionGuard } from "@/components/PermissionGuard";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const role = await fetchUniqueRoles(id).then((d) => d.json());
  const isRole = role && role.success

  return (isRole ? (
    <PermissionGuard name="Role" action="READ" fallback={<AccessDenied />}>
      <RoleEdit data={role.data} />
    </PermissionGuard>
  ) : (
    <SomethingWentWrong message={role.message} />
  ));
}
