import TitlePage from "@/components/custom/page-heading";
import RoleForm from "./RoleForm";

export default function Role() {
  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Create Role" description="Define a new role" createPage/>
      <RoleForm/>
    </div>
  );
}