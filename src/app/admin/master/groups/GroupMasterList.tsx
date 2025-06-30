"use client";

import { toast } from 'sonner';

import { DataTable } from '@/components/_data-table/data-table';
import { FetchResponse } from '@/types';
import { GroupListProps } from '@/types/group';

import { GroupsMasterColumns } from './groups-column-data';

const GroupMasterList = ({ data, moduleId }: GroupListProps) => {

  const { columns } = GroupsMasterColumns();

  const deleteRecord = async (id: string | string[]) => {
    const ids = Array.isArray(id) ? id : [id];
    try {
      const response = await fetch("/api/master/group", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      const result: FetchResponse = await response.json();
      if (response.ok) {
        toast.success("Group deleted successfully");
      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Error deleting group");
    }
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      deleteRecord={deleteRecord}
      moduleId={moduleId}
      pageSize={10}
    />
  );
}

export default GroupMasterList;