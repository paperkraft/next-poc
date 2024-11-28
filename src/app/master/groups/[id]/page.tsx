import prisma from "@/lib/prisma";
import EditGroup from "./EditGroup";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
  
    const role = await prisma.group.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
      },
    });
  
    if (!role) {
      return <>No group found</>;
    }
    return role && <EditGroup data={role} />;
  }