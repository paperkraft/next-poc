import prisma from "@/lib/prisma";
import EditModule from "./EditModule";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const module = await prisma.module.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      parent:true,
      parentId: true,
      //   permissions: true,
      SubModules:{
        select:{
            id: true,
            name: true,
            parentId: true
            // permissions: true,
        }
      }
    }
  });

  if (!module) {
    return <>No module found</>;
  }
  return module && <EditModule data={module} />;
}
