"use client";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Eye, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type RoleType = {
  id: string;
  name: string;
  permissions: number;
};

export default function RoleList() {
  const route = useRouter();
  const path = usePathname();

  const [data, setData] = useState<RoleType[]>([]);

  useEffect(() => {
    const getRoles = async () => {
      const res = await fetch("/api/master/role");
      const data = await res.json();
      if (data.success) {
        setData(data.data);
      }
    };

    getRoles();
  }, []);

  return (
    <div className="space-y-8 p-2">
      <TitlePage title="Role" description="Define role">
        <div className="flex gap-2">
          <Button
            className="size-7"
            variant={"outline"}
            size={"sm"}
            onClick={() => route.push(`${path}/add`)}
          >
            <Plus className="size-5" />
          </Button>
        </div>
      </TitlePage>

      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permisisions</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data &&
            data.map((item, index) => (
              <TableRow key={item.name}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.permissions}</TableCell>
                <TableCell>
                  <Button
                    variant={"ghost"}
                    className="size-5"
                    onClick={() => route.push(`${path}/${item.id}`)}
                  >
                    <Eye className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {data && data?.length == 0 && (
            <TableRow>
              <TableCell colSpan={3}>No Data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
