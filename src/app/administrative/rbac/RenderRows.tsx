import { SwitchButton } from "@/components/_form-controls/SwitchButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";
import { IModule } from "./helper";

interface IRenderRows {
    data: IModule;
    parentIndex: string;
    index: number;
    level: number;
  }

const renderDash = (count: number) => {
    return (
        <span className="text-muted-foreground">{`|${Array(count)
            .fill("-")
            .join("")} `}</span>
    );
};

const RenderRows = React.memo(
    ({ data, index, level, parentIndex }: IRenderRows) => {
        const hasSubModules = data?.subModules?.length > 0;
        return (
            <Collapsible asChild key={index}>
                <React.Fragment>
                    <TableRow className="">
                        <CollapsibleTrigger asChild className="[&[data-state=open]>svg]:rotate-90">
                            <TableCell className={cn(`pl-${data?.parentId && level * 2}`, { "flex items-center first:gap-2 cursor-pointer": hasSubModules })}>
                                {data?.parentId ? renderDash(level) : null}
                                {data?.name}
                                {hasSubModules ? <ChevronRight className="size-4 transition-transform" /> : null}
                            </TableCell>
                        </CollapsibleTrigger>

                        {hasSubModules && <TableCell colSpan={4}></TableCell>}

                        {!hasSubModules && data?.permissions && data?.permissions.map((permission, i) => (
                            <TableCell key={permission.name}>
                                <SwitchButton name={`modules.${parentIndex}${index}.permissions.${i}.bitmask`} />
                            </TableCell>
                        ))}
                    </TableRow>

                    <CollapsibleContent asChild>
                        <React.Fragment>
                            {data?.subModules &&
                                data?.subModules.map((sub, ii) => (
                                    <RenderRows
                                        key={sub.id}
                                        data={sub}
                                        index={ii}
                                        level={level + 1}
                                        parentIndex={`${parentIndex}${index}.subModules.`}
                                    />
                                ))}
                        </React.Fragment>
                    </CollapsibleContent>
                </React.Fragment>
            </Collapsible>
        );
    }
);

RenderRows.displayName = 'RenderRows';
export default RenderRows;