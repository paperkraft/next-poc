import TitlePage from "@/components/custom/page-heading";
import RoleForm from "./RoleForm";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";

export default async function Role() {

  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  if (!permission) {
    return <AccessDenied />;
  }
  
  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Create Role" description="Define a new role" createPage />
      <RoleForm />
    </div>
  );
}