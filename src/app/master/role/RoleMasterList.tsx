"use client";
import { memo } from "react";
import { IRole } from "@/app/_Interface/Role";
import { DataTable } from "@/components/_data-table/data-table";
import { RoleMasterColumns } from "./role-column-data";

interface RoleMasterProps {
  data: IRole[];
}

const RoleMasterList = memo(({ data }: RoleMasterProps) => {
  const { columns } = RoleMasterColumns();

  const deleteRecord = async (ids: string | string[]) => {
    try {
      await fetch("/api/master/role", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        deleteRecord={deleteRecord}
        pageSize={10}
      />
    </>
  );
});

RoleMasterList.displayName = "RoleMasterList";
export default RoleMasterList;