import prisma from "@/lib/prisma";
import RoleEdit from "./RoleEdit";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const role = await prisma.role.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      permissions: true,
    },
  });

  if (!role) {
    return <>No role found</>;
  }
  return role && <RoleEdit data={role} />;
}
