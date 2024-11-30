import TitlePage from "@/components/custom/page-heading";
import prisma from "@/lib/prisma";
import GroupList from "./GroupList";
import NoRecordPage from "@/components/custom/no-record";
import { auth } from "@/auth";
import { findModuleId } from "@/utils/helper";

export interface IGroup {
  id: string;
  name: string;
};

async function fetchGroups() {
  try {
    const groups = await prisma.group.findMany({
      select: { id: true, name: true }
    });
    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
    return null;
  }
}

export default async function Page() {
  const groups = await fetchGroups();
  const session = await auth();
  const moduleId = findModuleId( session?.user.modules, "Role") as string;

  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Group" description="List of all groups, basically to catagorized menu" listPage moduleId={moduleId}/>
      {groups && groups.length > 0 ? (
        <GroupList data={groups} />
      ) : (
        <NoRecordPage text={"group"} />
      )}
    </div>
  );
}