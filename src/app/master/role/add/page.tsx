import TitlePage from "@/components/custom/page-heading";
import RoleForm from "./RoleForm";
import { PermissionGuard } from "@/components/PermissionGuard";

export default async function Role() {
  return (
    <PermissionGuard name="Role" action="WRITE">
      <div className="space-y-4 p-2">
        <TitlePage title="Create Role" description="Define a new role" createPage />
        <RoleForm />
      </div>
    </PermissionGuard>
  );
}