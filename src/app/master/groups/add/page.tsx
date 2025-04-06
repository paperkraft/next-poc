import TitlePage from "@/components/custom/page-heading";
import GroupForm from "./GroupForm";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  // if (!permission) {
  //   return <AccessDenied />;
  // }
  
  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Create Group" description="Define a new group" createPage />
      <GroupForm />
    </div>
  );
}