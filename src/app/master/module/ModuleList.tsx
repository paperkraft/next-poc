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
import { Modules } from "./page";
import React from "react";

export default function ModuleList({data}:{data:Modules[]}) {
    const path = usePathname();

    console.log('data', data);
    

  return (
    <div className="space-y-8 p-2">
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
            { data && data.map((item, index) => (<Nested data={item} key={index}/>))}
        </TableBody>
      </Table>
    </div>
  );
}

function Nested({data}:{data:Modules}){

    const path = usePathname();
    if(data?.submodules?.length == 0){
        return(
            <TableRow>
                <TableCell></TableCell>
                <TableCell>{data?.name}</TableCell>
                <TableCell>{data?.permissions}</TableCell>
                <TableCell>
                    <Button variant={"ghost"} className="size-5" asChild>
                        <Link href={`${path}/${data?.id}`}><Eye className="size-4" /></Link>
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    return(
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
                    <TableCell className="text-left">{data?.name}</TableCell>
                    <TableCell className="text-left">{data?.permissions}</TableCell>
                    <TableCell>
                        <Button variant={"ghost"} className="size-5" asChild>
                            <Link href={`${path}/${data.id}`}><Eye className="size-4" /></Link>
                        </Button>
                    </TableCell>
                </TableRow>

                <CollapsibleContent asChild>
                        <TableRow>
                            {data && data?.submodules.map((sub)=>(
                                <React.Fragment key={sub?.id}>
                                    <TableCell></TableCell>
                                    <TableCell className="text-left">{`|-- ${sub?.name}`}</TableCell>
                                    <TableCell className="text-left">{sub?.permissions}</TableCell>
                                    <TableCell>
                                        <Button variant={"ghost"} className="size-5" asChild>
                                            <Link href={`${path}/${sub?.id}`}><Eye className="size-4" /></Link>
                                        </Button>
                                    </TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                </CollapsibleContent>
            </React.Fragment>
        </Collapsible>
    )
}