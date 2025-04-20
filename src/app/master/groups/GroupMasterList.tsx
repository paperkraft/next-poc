"use client";

import { toast } from 'sonner';

import { DataTable } from '@/components/_data-table/data-table';
import { useMounted } from '@/hooks/use-mounted';
import { GroupListProps } from '@/types/group';

import { GroupsMasterColumns } from './groups-column-data';
import { deleteGroup } from '@/app/action/group.action';
import { FetchResponse } from '@/types';

const GroupMasterList = ({ data, moduleId }: GroupListProps) => {
  const { columns } = GroupsMasterColumns();
  const mounted = useMounted();

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
    mounted &&
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
}

export default GroupMasterList;