import prisma from "@/lib/prisma";
import TitlePage from "@/components/custom/page-heading";
import RoleList from "./List";
import NoRecordPage from "@/components/custom/no-record";
import useModuleIdByName from "@/hooks/use-module-id";
import { IModule } from "../module/ModuleInterface";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";

export async function fetchRoles() {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        permissions: true,
      },
    });
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
}

export default async function Page() {
  const roles = await fetchRoles();
  const session = await auth();
  const moduleId = findModuleId( session?.user.modules, "Role") as string;

  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Role" description="List of all roles" listPage moduleId={moduleId}/>
      {roles && roles.length > 0 ? (
        <RoleList data={roles} />
      ) : (
        <NoRecordPage text={"role"}/>
      )}
    </div>
  );
}