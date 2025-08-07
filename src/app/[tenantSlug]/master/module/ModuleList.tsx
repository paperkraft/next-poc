"use client";
import { LayoutDashboard, List } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/components/_data-table/data-table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import GroupTable from './components/GroupedTable';
import { ModuleMasterColumns } from './module-list-column';
import { GroupedMenus, MenuItem } from '@/lib/menus';

interface ModuleMasterProps {
  data: MenuItem[];
  moduleId?: number
}

const ModuleMasterList = ({ data, moduleId }: ModuleMasterProps) => {
  const [toggle, setToggle] = useState(false);
  const { columns } = ModuleMasterColumns();

  const groupedModules = data && groupModules(data.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity)));
  const moduleData = data && data.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity)).map((item) => item);

  const deleteRecord = async (ids: number | number[]) => {
    try {
      const res = await fetch("/api/master/module", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Module deleted successfully");
      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error("Error deleting module", error);
      toast.error("Error deleting module");
    }
  }

  return (
    <>
      <ToggleGroup type="single" size={"sm"} className="justify-end" defaultValue="list">
        <ToggleGroupItem value={'list'} onClick={() => setToggle(false)}><List className="h-4 w-4" /></ToggleGroupItem>
        <ToggleGroupItem value={'group'} onClick={() => setToggle(true)}><LayoutDashboard className="h-4 w-4" /></ToggleGroupItem>
      </ToggleGroup>

      <div>
        {
          !toggle ? (
            <DataTable
              columns={columns}
              data={moduleData}
              deleteRecord={deleteRecord}
              moduleId={moduleId}
              pageSize={10}
            />
          ) : (
            <GroupTable groupedModules={groupedModules} />
          )
        }
      </div>
    </>
  );
};

export default ModuleMasterList;

export const groupModules = (modules: MenuItem[]): GroupedMenus[] => {
  const groupMap = new Map<number, GroupedMenus>();

  for (const mod of modules) {
    if (!groupMap.has(+mod?.groupId!)) {
      groupMap.set(+mod?.groupId!, {
        groupId: +mod?.groupId!,
        groupName: mod.groupName as string,
        modules: [],
        sortOrder: Number(mod.sortOrder)
      });
    }

    groupMap.get(mod?.groupId!)!.modules.push(mod);
  }
  return Array.from(groupMap.values()).map((group) => ({
    ...group,
    modules: group.modules.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity)),
  }));
};