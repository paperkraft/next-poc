import { Edit, Eye, Trash2 } from "lucide-react";

export const permissionConfig = [
    { key: "READ", label: "Read", icon: Eye, color: "bg-blue-100 text-blue-700" },
    { key: "WRITE", label: "Write", icon: Edit, color: "bg-green-100 text-green-700" },
    { key: "UPDATE", label: "Update", icon: Edit, color: "bg-yellow-100 text-yellow-700" },
    { key: "DELETE", label: "Delete", icon: Trash2, color: "bg-red-100 text-red-700" },
] as const