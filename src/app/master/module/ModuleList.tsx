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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Eye, ChevronRight, List, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IModule } from "@/app/_Interface/Module";
import { DataTable } from "@/components/_data-table/data-table";
import { ModuleMasterColumns } from "./module-list-column";

interface ModuleMasterProps {
    data: IModule[];
    moduleId?: string
}

const ModuleMasterList = memo(({ data, moduleId }: ModuleMasterProps) => {
    const { columns } = ModuleMasterColumns();

    const grouped = data && groupByGroupIfParentIdIsNull(data);
    const [toggle, setToggle] = useState(false);

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
                            data={data}
                            // deleteRecord={deleteRecord}
                            moduleId={moduleId}
                            pageSize={10}
                        />
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                <TableRow>
                                    <TableHead>Group</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    grouped && grouped.map((item, index) => (
                                        <Collapsible asChild key={index}>
                                            <React.Fragment>
                                                <CollapsibleTrigger asChild>
                                                    <TableRow className="cursor-pointer data-[state=open]:bg-muted [&[data-state=open]>td>svg]:rotate-90">
                                                        <TableCell className="flex items-center gap-2">
                                                            <ChevronRight className="h-4 w-4" />
                                                            {item.group}
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent asChild>
                                                    <React.Fragment>
                                                        {
                                                            item.modules.map((module, index) => (
                                                                <Tree key={index} data={module} level={1} />
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                </CollapsibleContent>

                                            </React.Fragment>
                                        </Collapsible>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )
                }
            </div>
        </>
    );
})

const Tree = memo(({ data, level }: { data: IModule, level: number }) => {
    const path = usePathname();
    const hasSubModules = data && data?.subModules?.length > 0;
    return (
        <Collapsible asChild>
            <React.Fragment>
                <CollapsibleTrigger asChild>
                    <TableRow className={cn("align-middle h-10", { "cursor-pointer data-[state=open]:bg-muted [&[data-state=open]>td>svg]:rotate-90": hasSubModules })}>
                        <TableCell style={{ paddingLeft: `${level * 32}px` }} className={cn({ "flex items-center gap-2": hasSubModules })}>
                            {data?.name}
                            {hasSubModules && <ChevronRight className="size-4 transition-transform" />}
                        </TableCell>
                        <TableCell>
                            <Button variant={"ghost"} className="size-4 hover:text-blue-500" asChild size={'icon'}>
                                <Link href={`${path}/${data.id}`}><Eye className="size-4" /></Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                </CollapsibleTrigger>

                <CollapsibleContent asChild>
                    <React.Fragment>
                        {
                            data && data.subModules.map((sub, index) => (
                                <Tree key={index} data={sub} level={level + 1} />
                            ))
                        }
                    </React.Fragment>
                </CollapsibleContent>
            </React.Fragment>
        </Collapsible>
    )
})

function groupByGroupIfParentIdIsNull(modules: IModule[]): { group: string, modules: IModule[] }[] {
    const filteredModules = modules.filter(module => module.parentId === null);
    const grouped = filteredModules.reduce((acc, module) => {
        const group = module.group || 'Uncategorized';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(module);
        return acc;
    }, {} as { [key: string]: IModule[] });

    return Object.keys(grouped).map(group => ({
        group,
        modules: grouped[group]
    }));
}

Tree.displayName = 'Tree';
ModuleMasterList.displayName = 'ModuleMasterList';

export default ModuleMasterList;