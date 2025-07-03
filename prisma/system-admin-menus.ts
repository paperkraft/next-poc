export const SystemAdminMenus = [
    {
        name: "Tenant Management",
        icon: "Building2",
        children: [
            { name: "All Tenants", path: "/admin/tenants" },
            { name: "Create Tenant", path: "/admin/tenants/create" },
            { name: "Tenant Analytics", path: "/admin/tenants/analytics" },
        ],
    },
    {
        name: "System Users",
        icon: "Users",
        children: [
            { name: "All Users", path: "/admin/users" },
            { name: "Global Roles", path: "/admin/global-roles" },
            { name: "User Analytics", path: "/admin/users/analytics" },
        ],
    },
    {
        name: "System Settings",
        icon: "Settings",
        children: [
            { name: "Global Settings", path: "/admin/settings" },
            { name: "System Permissions", path: "/admin/permissions" },
            { name: "Feature Flags", path: "/admin/features" },
        ],
    },
    {
        name: "Audit & Monitoring",
        icon: "Activity",
        children: [
            { name: "Audit Logs", path: "/admin/audit-logs" },
            { name: "System Health", path: "/admin/health" },
            { name: "Performance", path: "/admin/performance" },
        ],
    },
]