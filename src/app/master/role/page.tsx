import prisma from "@/lib/prisma";
import RoleList from "./List";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
      permissions: true,
    },
  });

  return (
    <div className="space-y-8 p-2">
      <TitlePage title="Roles" description="List of all roles">
      <div className="flex gap-2">
        <Button className="size-7" variant={"outline"} size={"sm"} asChild>
          <Link href={'/master/role/add'}><Plus className="size-5" /></Link>
        </Button>
      </div>
    </TitlePage>
      { roles && <RoleList data={roles}/> }
    </div>
  )
}
