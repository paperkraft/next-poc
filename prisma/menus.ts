export const SystemAdminMenus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "BarChart3",
    children: [],
  },
  {
    name: "Tenant Management",
    icon: "Building2",
    children: [
      { name: "All Tenants", path: "/tenants" },
      { name: "Create Tenant", path: "/tenants/create" },
      { name: "Tenant Analytics", path: "/tenants/analytics" },
    ],
  },
  {
    name: "System Users",
    icon: "Users",
    children: [
      { name: "All Users", path: "/users" },
      { name: "Global Roles", path: "/global-roles" },
      { name: "User Analytics", path: "/users/analytics" },
    ],
  },
  {
    name: "System Settings",
    icon: "Settings",
    children: [
      { name: "Global Settings", path: "/settings" },
      { name: "System Permissions", path: "/permissions" },
      { name: "Feature Flags", path: "/features" },
      { name: "Push Notifications", path: "/push-notification" },
    ],
  },
  {
    name: "Audit & Monitoring",
    icon: "Activity",
    children: [
      { name: "Audit Logs", path: "/audit-logs" },
      { name: "System Health", path: "/health" },
      { name: "Performance", path: "/performance" },
    ],
  },
  {
    name: "UI Blocks",
    icon: "BlocksIcon",
    children: [
      { name: "Stepper Form", path: "/ui-blocks/stepper-form" },
      { name: "Form Builder", path: "/ui-blocks/form-builder" },
      { name: "Full Calendar", path: "/ui-blocks/full-calendar" },
    ],
  },
];

export const Masters = [
  {
    name: "Master",
    icon: "LayoutGrid",
    children: [
      { name: "Module", path: "/master/module" },
      { name: "Role", path: "/master/role" },
      { name: "Groups", path: "/master/groups" },
    ],
  },
];

export const TenantMenus = [
  {
    management: [
      {
        name: "Academic Management",
        icon: "GraduationCap",
        children: [
          { name: "Students", path: "/students" },
          { name: "Faculty", path: "/faculty" },
          { name: "Courses", path: "/courses" },
          { name: "Programs", path: "/programs" },
          { name: "Departments", path: "/departments" },
        ],
      },
      {
        name: "Administration",
        icon: "FileText",
        children: [
          { name: "Admissions", path: "/admissions" },
          { name: "Enrollment", path: "/enrollment" },
          { name: "Scheduling", path: "/scheduling" },
          { name: "Examinations", path: "/examinations" },
        ],
      },
      {
        name: "Financial Management",
        icon: "DollarSign",
        children: [
          { name: "Fee Management", path: "/fees" },
          { name: "Scholarships", path: "/scholarships" },
          { name: "Payroll", path: "/payroll" },
        ],
      },
    ],
  },
  {
    settings: [
      {
        name: "User Management",
        icon: "Users",
        children: [
          { name: "Users", path: "/admin/users" },
          { name: "Roles", path: "/admin/roles" },
          { name: "Permissions", path: "/admin/permissions" },
        ],
      },
      {
        name: "System",
        icon: "Settings",
        children: [
          { name: "Widgets Settings", path: "/admin/widgets" },
          { name: "Institute Settings", path: "/admin/settings" },
          { name: "Audit Logs", path: "/admin/audit" },
        ],
      },
    ],
  },
];

export const Widgets = [
  {
    key: "STATS",
    name: "Statistics",
    component: "StatsWidget",
    description: "Key metrics and numbers",
    category: "analytics",
  },
  {
    key: "TIMETABLE",
    name: "Time Table",
    component: "TimetableWidget",
    description: "Class schedule and timings",
    category: "organization",
  },
  {
    key: "ATTENDANCE",
    name: "Attendance Tracker",
    component: "AttendanceWidget",
    description: "Attendance Tracker",
    category: "management",
  },
  {
    key: "ASSIGNMENTS",
    name: "Assignments",
    component: "AssignmentsWidget",
    description: "Upcoming and pending work",
    category: "academics",
  },
  {
    key: "GRADES",
    name: "Gradebook",
    component: "GradesWidget",
    description: "Gradebook",
    category: "academics",
  },
  {
    key: "NOTICES",
    name: "Announcements",
    component: "NoticesWidget",
    description: "Important announcements",
    category: "communication",
  },
];
