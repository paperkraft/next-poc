'use client'
import { calculateDateWiseOnlineSessions, DateWiseOnlineSession } from "@/app/action/audit.action";
import { DataTable } from "@/components/data-table/data-table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getFormattedDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoginSessionColumns } from "./column-data";
import { Row } from "@tanstack/react-table";


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

const checkWorkingHours = (time: string) => {
    const hh = time.split(':')[0];
    const check = Number(hh) > 9;
    return check
}

interface Users {
    id: string;
    firstName: string;
    lastName: string;
}

const fetchUser = async (): Promise<Users[] | null | undefined> => {
    try {
        const res = await fetch('/api/user').then((res) => res.json());

        if (res.success) {
            return res.data && res.data as Users[]
        } else {
            toast.error("Error in fecting users");
            return null
        }

    } catch (error) {
        console.error("Error in fecting users", error);
        toast.error("Error in fecting users");
    }
}

const fetchLogSession = async (userId: string): Promise<DateWiseOnlineSession[] | null | undefined> => {
    try {
        const loginSession = await calculateDateWiseOnlineSessions(userId);
        return loginSession;
    } catch (error) {
        console.error("Error in fecting loginSession", error);
        toast.error("Error in fecting loginSession");
    }
}

export default function LoginSessionTable() {

    const [user, setUser] = useState<string | null>("");
    const [data, setData] = useState<DateWiseOnlineSession[] | null>(null);

    const { data: users, isLoading } = useQuery({ queryKey: ["users"], queryFn: fetchUser });
    const { data: loginSession, isLoading: isSessionLoading } = useQuery({ queryKey: ["logSession", user], queryFn: () => user && fetchLogSession(user) as any });

    useEffect(() => {
        if (loginSession) {
            setData(orderByDateDesc(loginSession));
        }
    }, [loginSession, user]);

    const { columns } = LoginSessionColumns()

    return (
        <>
            <div className="w-full max-w-sm space-y-1">
                <Label htmlFor="user">User</Label>
                <Select name="user" value={user ?? ""} onValueChange={(value) => { setUser(value) }}>
                    <SelectTrigger className="">
                        <SelectValue placeholder={isLoading ? <span className="flex items-center gap-1"><Loader2 className="size-4 animate-spin" /> Loading...</span> : "Select User"} />
                    </SelectTrigger>
                    <SelectContent>
                        {users && users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                {`${user.firstName} ${user.lastName}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md hidden">
                <Table className="border-b">

                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Login Time</TableHead>
                            <TableHead>Logout Time</TableHead>
                            <TableHead>{`Duration (H)`}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data && data?.map((item, idx) => (
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
                                                    <TableRow key={idxII} >
                                                        <TableCell></TableCell>
                                                        <TableCell>{ele.startTime}</TableCell>
                                                        <TableCell>{ele.endTime === 'active' ? 'Active' : ele.endTime}</TableCell>
                                                        <TableCell className={cn({ "text-red-500": checkWorkingHours(ele.duration) })}>{ele.duration} {checkWorkingHours(ele.duration) ? "#" : null}</TableCell>
                                                    </TableRow>
                                                )).reverse()}
                                            </React.Fragment>
                                        </CollapsibleContent>
                                    </React.Fragment>
                                </Collapsible>
                            ))
                        }
                        {!data && isSessionLoading &&
                            <TableRow className="h-40">
                                <TableCell colSpan={4} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        }
                        {!data && !isSessionLoading &&
                            <TableRow className="h-40">
                                <TableCell colSpan={4} className="text-center">
                                    No record
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                    {
                        data &&
                        <TableCaption className="text-left p-2 m-0" >
                            <p>* Forgot to logout.</p>
                            <p># beyond working hours.</p>
                        </TableCaption>
                    }
                </Table>
            </div>

            {data && !isSessionLoading &&
                <div>
                    <DataTable columns={columns} data={data} getRowCanExpand={() => true} />
                    <div className="text-muted-foreground text-sm text-left p-2 m-0" >
                        <p>* Forgot to logout.</p>
                        <p># beyond working hours.</p>
                    </div>
                </div>
            }

            {isSessionLoading &&
                <div className="h-40 border rounded-md flex justify-center items-center">
                    <p className="text-center">Loading...</p>
                </div>
            }
            {!data && !isSessionLoading &&
                <div className="h-40 border rounded-md flex justify-center items-center">
                    <p className="text-center">No record</p>
                </div>
            }
        </>
    );
}