'use client'
import { DateWiseOnlineSession, LoginDetail } from "@/app/action/audit.action";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getFormattedDate, getLocalTime } from "@/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

interface LoginSessionProps {
    loginSession: DateWiseOnlineSession[] | null;
}

interface Session {
    startTime: string;
    endTime: string;
    duration: string;
}

interface DataItem {
    date: string;
    sessions: Session[];
}

function orderByDateDesc(data: DataItem[]): DataItem[] {
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function LoginSession({ loginSession }: LoginSessionProps) {
    const data = loginSession && orderByDateDesc(loginSession)
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Login</TableHead>
                        <TableHead>Logout</TableHead>
                        <TableHead>Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.map((item, idx) => (
                            <Collapsible key={idx} asChild>
                                <React.Fragment>
                                    <TableRow>
                                        <CollapsibleTrigger asChild className="[&[data-state=open]>div>svg]:rotate-90">
                                            <TableCell colSpan={4} className="cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    <ChevronRight className="size-4 transition-transform" />
                                                    {getFormattedDate(new Date(item.date))}
                                                </div>
                                            </TableCell>
                                        </CollapsibleTrigger>
                                    </TableRow>

                                    <CollapsibleContent asChild>
                                        <React.Fragment>
                                            {item?.sessions?.map((ele, idxII) => (
                                                <TableRow key={idxII}>
                                                    <TableCell></TableCell>
                                                    <TableCell>{getLocalTime(new Date(ele.startTime))}</TableCell>
                                                    <TableCell>{ele.endTime === 'active' ? 'Active' : getLocalTime(new Date(ele.endTime))}</TableCell>
                                                    <TableCell>{ele.duration}</TableCell>
                                                </TableRow>
                                            ))}
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