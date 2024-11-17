"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export type RoleType = {
  id: string;
  name: string;
  permissions: number;
};

export default function RoleList({data}:{data:RoleType[]}) {
  const route = useRouter();
  const path = usePathname();

  return (
    <div className="space-y-8 p-2">
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
