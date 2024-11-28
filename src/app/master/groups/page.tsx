import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import GroupList from "./GroupList";

export interface IGroup {
    id: string;
    name: string;
};

export default async function Page() {

    try {
        const groups = await prisma.group.findMany({
            select: { id:true, name:true }
        });
  
      return (
        <div className="space-y-8 p-2">
          <TitlePage title="Group List" description="List of all groups">
            <div className="flex gap-2">
              <Button className="size-7" variant={"outline"} size={"sm"} asChild>
                <Link href={'/master/groups/add'}>
                  <Plus className="size-5" />
                </Link>
              </Button>
            </div>
          </TitlePage>
          {!groups && <>No data found...</>}
          {groups && <GroupList data={groups} />}
        </div>
      )
    } catch (error) {
      console.error(error);
      return <>Failed to fetch data...</>
    }
  }