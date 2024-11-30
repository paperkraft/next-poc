import prisma from "@/lib/prisma";
import EditGroup from "./EditGroup";
import NoRecordPage from "@/components/custom/no-record";

async function fetchUniqueGroup(id: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
      },
    });
    return group;
  } catch (error) {
    console.error("Error fetching group:", error);
    return null;
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const group = await fetchUniqueGroup(id);

  return (group ? (
    <EditGroup data={group} />
  ) : (
    <NoRecordPage text={"group"} />
  ));
}