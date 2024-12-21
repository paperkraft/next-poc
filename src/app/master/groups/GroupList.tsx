"use client";
import { IOptionGroup } from "@/app/_Interface/Group";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

 const GroupList = memo(({data}:{data:IOptionGroup[]}) => {
  const path = usePathname();
  return (
    <div className="space-y-8 p-2">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data &&
            data.map((item, index) => (
              <TableRow key={item.label}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.label}</TableCell>
                <TableCell>
                  <Button variant={"ghost"} className="size-5" asChild>
                    <Link href={`${path}/${item.value}`}><Eye className="size-4" /></Link>
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
})

GroupList.displayName = "GroupList";
export default GroupList