import RoleEdit from "./RoleEdit";
import { fetchUniqueRoles } from "@/app/action/role.action";
import { auth } from "@/auth";
import AccessDenied from "@/components/custom/access-denied";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { hasPermission } from "@/lib/rbac";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const role = await fetchUniqueRoles(id).then((d) => d.json());
  const isRole = role && role.success

  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  if (!permission) {
    return <AccessDenied />;
  }

  return (isRole ? (
    <RoleEdit data={role.data} />
  ) : (
    <SomethingWentWrong message={role.message} />
  ));
}
