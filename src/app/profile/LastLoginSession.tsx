'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoginDetail } from "../action/audit.action";

interface LastLoginSessionProps {
    lastLogins: LoginDetail[] | null
}

export default function LastLoginSession({ lastLogins }: LastLoginSessionProps) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date and Time</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>IP</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        lastLogins?.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell>{item.device}</TableCell>
                                <TableCell>{item.ipAddress}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    );
}