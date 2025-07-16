"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const recentTenants = [
    {
        id: 1,
        name: "Westfield Academy",
        type: "SCHOOL",
        status: "pending",
        users: 0,
        createdAt: "2024-01-15",
    },
    {
        id: 2,
        name: "Metro Community College",
        type: "COLLEGE",
        status: "active",
        users: 1247,
        createdAt: "2024-01-12",
    },
    {
        id: 3,
        name: "Riverside Elementary",
        type: "SCHOOL",
        status: "active",
        users: 456,
        createdAt: "2024-01-10",
    },
    {
        id: 4,
        name: "Tech Innovation Society",
        type: "SOCIETY",
        status: "active",
        users: 89,
        createdAt: "2024-01-08",
    },
]

export function RecentTenantsTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{tenant.type}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={tenant.status === "active" ? "default" : "secondary"}>{tenant.status}</Badge>
                        </TableCell>
                        <TableCell>{tenant.users.toLocaleString()}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                                    <DropdownMenuItem>Manage Users</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}