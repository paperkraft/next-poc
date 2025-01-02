"use client";
import { ColumnDef } from "@tanstack/react-table";

const header = [
    { label: "User", value: "user" },
    { label: "Action", value: "action" },
    { label: "Entity", value: "entity" },
    { label: "Details", value: "details" },
    { label: "Device", value: "device" },
    { label: "Date and Time", value: "timestamp" },
]

export const createColumns = (): ColumnDef<any>[] => {
    const columns: ColumnDef<any>[] = header.map((item) => {
        return{
            accessorKey: item.value,
            header: item.label
        }
    })
    return columns;
};