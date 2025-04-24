"use client";
import { LayoutDashboard, List } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { groupModules } from '@/app/administrative/rbac/helper';
import { DataTable } from '@/components/_data-table/data-table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { IModule } from '@/types/permissions';

import GroupTable from './components/GroupedTable';
import { ModuleMasterColumns } from './module-list-column';

interface ModuleMasterProps {
    data: IModule[];
    moduleId?: string
}

const ModuleMasterList = ({ data, moduleId }: ModuleMasterProps) => {
    const [toggle, setToggle] = useState(false);
    const { columns } = ModuleMasterColumns();

    const groupedModules = data && groupModules(data.sort((a, b) => a.position - b.position));
    const moduleData = data && data.sort((a, b) => a.position - b.position).map((item) => item);

    const deleteRecord = async (id: string | string[]) => {
        const ids = Array.isArray(id) ? id : [id];
    
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