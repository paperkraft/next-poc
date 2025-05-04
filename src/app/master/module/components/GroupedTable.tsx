'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';
import { IGroupedModule, IModule } from '@/types/permissions';

export default function GroupTable({ groupedModules }: { groupedModules: IGroupedModule[] }) {
    return (
        <>
            <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                        <TableHead>Group</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        groupedModules?.map((item, index) => (
                            <Collapsible asChild key={index}>
                                <React.Fragment>
                                    <CollapsibleTrigger asChild>
                                        <TableRow className="cursor-pointer data-[state=open]:bg-muted [&[data-state=open]>td>svg]:rotate-90">
                                            <TableCell className="flex items-center gap-2">
                                                <ChevronRight className="h-4 w-4" />
                                                {item.groupName}
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
        </>
    );
}


const Tree = React.memo(({ data, level }: { data: IModule, level: number }) => {

    const mounted = useMounted();
    const path = usePathname();

    const hasSubModules = data && data?.subModules?.length > 0;
    
    if(!mounted) return null;

    return (
        <Collapsible asChild>
            <React.Fragment>
                <CollapsibleTrigger asChild>
                    <TableRow className={cn("align-middle h-10", { "cursor-pointer data-[state=open]:bg-muted [&[data-state=open]>td>svg]:rotate-90": hasSubModules })}>
                        <TableCell style={{ paddingLeft: `${level * 32}px` }} className={cn({ "flex items-center gap-2": hasSubModules })}>
                            {hasSubModules ? (
                                data?.name
                            ) : (
                                <Link
                                    href={`${path}/${data.id}`}
                                    className="hover:text-primary"
                                >
                                    {data?.name}
                                </Link>
                            )}
                            {hasSubModules && <ChevronRight className="size-4 transition-transform" />}
                        </TableCell>
                        <TableCell>
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
});