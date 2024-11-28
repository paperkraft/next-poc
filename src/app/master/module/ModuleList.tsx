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
import { Eye, ChevronRight, List, Group, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IModule } from "./ModuleInterface";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ModuleList({ data }: { data: IModule[] }) {

    if (!data) {
        return <>No Data</>
    }

    const grouped = data && groupByGroupIfParentIdIsNull(data);
    const [toggle, setToggle] = useState(false);

    return (
        <div>
            <ToggleGroup type="single" size={"sm"} className="justify-end my-4">
                <ToggleGroupItem value={'list'} onClick={()=>setToggle(false)} defaultChecked><List className="h-4 w-4"/></ToggleGroupItem>
                <ToggleGroupItem value={'group'}onClick={()=>setToggle(true)}><LayoutDashboard className="h-4 w-4"/></ToggleGroupItem>
            </ToggleGroup>
            {
                !toggle &&
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data && data.map((item, index) => (<Nested data={item} key={index} level={0} />))}
                    </TableBody>
                </Table>
            }
            {
                toggle &&
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
                                                    item.modules.map((module, index) => {
                                                        return (<Tree key={index} data={module} level={1} />)
                                                    })
                                                }
                                            </React.Fragment>
                                        </CollapsibleContent>

                                    </React.Fragment>
                                </Collapsible>
                            ))
                        }
                    </TableBody>
                </Table>
            }
        </div>
    );
}

function Nested({ data, level }: { data: IModule, level: number }) {

    const path = usePathname();
    const hasSubModules = data?.subModules?.length > 0;

    const renderDash = (count: number) => {
        return <span className="text-muted-foreground">{`|${Array(count).fill('-').join('')} `}</span>
    }
    return (
        <Collapsible asChild>
            <React.Fragment>
                <TableRow>

                    <TableCell>
                        {
                            hasSubModules &&
                            <CollapsibleTrigger asChild>
                                <Button variant={"ghost"} className="flex h-6 w-6 p-0 data-[state=open]:bg-muted [&[data-state=open]>svg]:rotate-90">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>
                        }
                    </TableCell>

                    <TableCell>{data?.group}</TableCell>

                    <TableCell>
                        {data?.parentId ? renderDash(level) : null}
                        {data?.name}
                    </TableCell>
                    <TableCell>
                        <Button variant={"ghost"} className="size-7" asChild size={'icon'}>
                            <Link href={`${path}/${data.id}`}><Eye className="size-5" /></Link>
                        </Button>
                    </TableCell>
                </TableRow>

                <CollapsibleContent asChild>
                    <React.Fragment>
                        {data && data?.subModules.map((sub) => (
                            <Nested key={sub.id} data={sub} level={level + 1} />
                        ))}
                    </React.Fragment>
                </CollapsibleContent>
            </React.Fragment>
        </Collapsible>
    )
}

function Tree({ data, level }: { data: IModule, level: number }) {
    const path = usePathname();
    const hasSubModules = data && data?.subModules?.length > 0;
    return (
        <Collapsible asChild>
            <React.Fragment>
                <CollapsibleTrigger asChild>
                    <TableRow className={cn("align-middle h-10", { "cursor-pointer data-[state=open]:bg-muted [&[data-state=open]>td>svg]:rotate-90": hasSubModules })}>
                        <TableCell style={{ paddingLeft: `${level * 32}px` }} className={cn({ "flex items-center gap-2": hasSubModules })}>
                            {data?.name}
                            {hasSubModules && <ChevronRight className="size-4" />}
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
}

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