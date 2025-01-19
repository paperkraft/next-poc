"use client";
import { memo } from "react";
import { IGroup } from "@/app/_Interface/Group";
import { DataTable } from "@/components/data-table/data-table";
import { GroupsMasterColumns } from "./groups-column-data";

interface GroupListProps {
  data: IGroup[];
  moduleId?: string
}

const GroupMasterList = memo(({ data, moduleId }: GroupListProps) => {
  const { columns } = GroupsMasterColumns();

  const deleteRecord = async (ids: string | string[]) => {
    try {
      await fetch("/api/master/group", {
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
        moduleId={moduleId}
        pageSize={10}
      />
    </>
  );
})

GroupMasterList.displayName = "GroupMasterList";
export default GroupMasterList