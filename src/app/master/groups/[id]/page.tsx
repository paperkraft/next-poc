import SomethingWentWrong from "@/components/custom/somthing-wrong";
import EditGroup from "./EditGroup";
import { fetchUniqueGroup } from "@/app/action/group.action";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const role = await fetchUniqueGroup(id).then((d)=>d.json());
  const isRoles = role && role.success;

  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  if (!permission) {
    return <AccessDenied />;
  }

  return (isRoles ? (
    <EditGroup data={role.data} />
  ) : (
    <SomethingWentWrong message={role.message} />
  ));
}