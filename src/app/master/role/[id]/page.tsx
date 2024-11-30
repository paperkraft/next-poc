import prisma from "@/lib/prisma";
import RoleEdit from "./RoleEdit";
import NoRecordPage from "@/components/custom/no-record";

async function fetchUniqueRoles(id: string) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        permissions: true,
      },
    });
    return role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const role = await fetchUniqueRoles(id);

  return (role ? (
    <RoleEdit data={role} />
  ) : (
    <NoRecordPage text={"role"} />
  ));
}
