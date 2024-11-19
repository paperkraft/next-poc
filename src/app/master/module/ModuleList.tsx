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
import { Eye, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IModule } from "./ModuleInterface";

export default function ModuleList({ data }: { data: IModule[] }) {

    if (!data) {
        return null
    }

    return (
        <div>
            <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Permisisions</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map((item, index) => (<Nested data={item} key={index} level={0} />))}
                </TableBody>
            </Table>
        </div>
    );
}

function Nested({ data, level }: { data: IModule, level: number }) {

    const path = usePathname();
    const hasSubModules = data?.submodules?.length > 0;

    const renderDash = (count: number) => {
        return <span className="text-muted-foreground">{`|${Array(count).fill('-').join('')} `}</span>
    }

    if (!hasSubModules) {
        return (
            <TableRow>
                <TableCell></TableCell>
                <TableCell>{data?.parentId ? renderDash(level) : null}{data?.name}</TableCell>
                <TableCell>{data?.permissions}</TableCell>
                <TableCell>
                    <Button variant={"ghost"} className="size-7" asChild>
                        <Link href={`${path}/${data?.id}`}><Eye className="size-5" /></Link>
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <Collapsible asChild>
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <CollapsibleTrigger asChild>
                            <Button variant={"ghost"} className="flex h-6 w-6 p-0 data-[state=open]:bg-muted [&[data-state=open]>svg]:rotate-90">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>{data?.parentId ? renderDash(level) : null}{data?.name}</TableCell>
                    <TableCell>{data?.permissions}</TableCell>
                    <TableCell>
                        <Button variant={"ghost"} className="size-7" asChild size={'icon'}>
                            <Link href={`${path}/${data.id}`}><Eye className="size-5" /></Link>
                        </Button>
                    </TableCell>
                </TableRow>

                <CollapsibleContent asChild>
                    <React.Fragment>
                        {data && data?.submodules.map((sub) => (
                            <Nested key={sub.id} data={sub} level={level + 1} />
                        ))}
                    </React.Fragment>
                </CollapsibleContent>
            </React.Fragment>
        </Collapsible>
    )
}