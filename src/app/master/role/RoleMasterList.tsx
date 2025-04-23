"use client";

import { toast } from 'sonner';

import { DataTable } from '@/components/_data-table/data-table';
import { RoleListProps } from '@/types/role';

import { RoleMasterColumns } from './role-column-data';

const RoleMasterList = ({ data, moduleId }: RoleListProps) => {

  const { columns } = RoleMasterColumns();

  const deleteRecord = async (id: string | string[]) => {
    const ids = Array.isArray(id) ? id : [id];

    try {
      const res = await fetch("/api/master/role", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Role deleted successfully");
      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error("Error deleting role", error);
      toast.error("Error deleting role");
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
};

export default RoleMasterList;