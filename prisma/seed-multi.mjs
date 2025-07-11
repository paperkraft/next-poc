import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing data...");

  await prisma.pushSubscription.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuGroup.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.widget.deleteMany();

  console.log("✅ Database cleared.");

  console.log("🎭 Seeding Super Admin role...");
  const superAdminRole = await prisma.role.create({
    data: {
      name: "Super Admin",
      tenantId: null,
    },
  });

  console.log("📁 Seeding System Admin menu group...");

  const sysAdminGroups = [
    { name: "System Administration", position: 1 },
    { name: "Master", position: 2 },
  ]

  for (const g of sysAdminGroups) {
    await prisma.menuGroup.create({
      data: {
        name: g.name,
        position: g.position,
        tenantId: null
      }
    })
  }

  const allSysAdminGroups = await prisma.menuGroup.findMany({
    where: { tenantId: null }
  })

  // const sysAdminGroup = await prisma.menuGroup.create({
  //   data: {
  //     name: "System Administration",
  //     tenantId: null,
  //     position: 1,
  //   },
  // });

  // const sysAdminMasterGroup = await prisma.menuGroup.create({
  //   data: {
  //     name: "Master",
  //     tenantId: null,
  //     position: 2,
  //   },
  // });



  console.log("🛠️ Seeding System default Master menus...");

  for (const mod of defaultMaster) {
    await prisma.menuItem.create({
      data: {
        name: mod.name,
        path: mod.path,
        icon: mod.icon,
        groupId: allSysAdminGroups[1].id,
        tenantId: null,
      },
    });
  }

  console.log("🛠️ Seeding System Admin menus...");

  for (const parent of systemAdminMenus) {
    const parentItem = await prisma.menuItem.create({
      data: {
        name: parent.name,
        path: undefined,
        icon: parent.icon,
        tenantId: null,
        groupId: allSysAdminGroups[0].id,
      },
    });

    for (const child of parent.children) {
      await prisma.menuItem.create({
        data: {
          name: child.name,
          path: child.path,
          icon: undefined,
          tenantId: null,
          groupId: allSysAdminGroups[0].id,
          parentId: parentItem.id,
        },
      });
    }
  }

  const systemMenus = await prisma.menuItem.findMany({
    where: { tenantId: null },
  });

  for (const menu of systemMenus) {
    await prisma.rolePermission.create({
      data: {
        roleId: superAdminRole.id,
        menuId: menu.id,
        tenantId: null,
        permissionBits: 15,
      },
    });
  }

  const hashedSuperAdmin = await bcrypt.hash("123123", 10);
  await prisma.user.create({
    data: {
      email: "superadmin@email.com",
      password: hashedSuperAdmin,
      isActive: true,
      globalRoles: ["SYSTEM_ADMIN"],
      roleId: superAdminRole.id,
      profile: {
        create: {
          firstName: "Super",
          lastName: "Admin",
        },
      },
    },
  });

  // ==============================
  // MULTI-TENANT SEED LOOP START
  // ==============================

  console.log("🏢 Seeding sample tenants in loop...");

  const sampleTenants = [
    {
      name: "Sunrise Public School",
      slug: "sunrise",
      email: "admin@sunrise.edu",
      city: "Kolhapur",
      type: "SCHOOL",
      adminUser: {
        email: "admin@sunrise.edu",
        password: "admin",
        firstName: "Ajit",
        lastName: "Patil",
      },
    },
    {
      name: "Green Valley College",
      slug: "greenvalley",
      email: "admin@greenvalley.edu",
      city: "Pune",
      type: "COLLEGE",
      adminUser: {
        email: "admin@greenvalley.edu",
        password: "admin",
        firstName: "Neha",
        lastName: "Patil",
      },
    },
  ];

  for (const t of sampleTenants) {
    const tenant = await prisma.tenant.create({
      data: {
        name: t.name,
        slug: t.slug,
        description: `${t.name} is a reputed educational institute.`,
        type: t.type,
        address: {
          street: "123 School St",
          city: t.city,
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
        },
        contact: {
          phone: "+91-9876543210",
          email: t.email,
          website: `https://${t.slug}.edu`,
        },
        settings: {
          timezone: "Asia/Kolkata",
          academicYear: "2024-2025",
        },
        limits: {
          maxUsers: 1000,
          maxStorage: "10GB",
        },
        branding: {
          primaryColor: "#1565C0",
          secondaryColor: "#42A5F5",
          logo: "/logo.png",
        },
        features: ["attendance", "exams", "notifications"],
      },
    });

    const permissions = [
      { name: "view", bitmask: 1 },
      { name: "create", bitmask: 2 },
      { name: "update", bitmask: 4 },
      { name: "delete", bitmask: 8 },
    ];

    for (const perm of permissions) {
      await prisma.permission.create({
        data: {
          ...perm,
          tenantId: tenant.id,
        },
      });
    }

    const adminRole = await prisma.role.create({
      data: { name: "Admin", tenantId: tenant.id },
    });
    const facultyRole = await prisma.role.create({
      data: { name: "Faculty", tenantId: tenant.id },
    });
    const studentRole = await prisma.role.create({
      data: { name: "Student", tenantId: tenant.id },
    });

    // Create groups

    // const homeGroup = await prisma.menuGroup.create({
    //   data: { name: "Home", tenantId: tenant.id, position: 1 },
    // });

    // const managementGroup = await prisma.menuGroup.create({
    //   data: { name: "Management", tenantId: tenant.id, position: 2 },
    // });

    // const settingsGroup = await prisma.menuGroup.create({
    //   data: { name: "Settings", tenantId: tenant.id, position: 3 },
    // });

    const groups = [
      { name: "Home", position: 1 },
      { name: "Management", position: 2 },
      { name: "Settings", position: 3 },
    ]

    for (const g of groups) {
      await prisma.menuGroup.create({
        data: {
          name: g.name,
          position: g.position,
          tenantId: tenant.id
        }
      })
    }

    const allGroups = await prisma.menuGroup.findMany({
      where: { tenantId: tenant.id }
    })

    // home
    await prisma.menuItem.create({
      data: {
        name: "Dashboard",
        path: "/dashboard",
        icon: "BarChart3",
        groupId: allGroups[0].id,
        tenantId: tenant.id,
      },
    });

    // For management menus
    for (const parent of tenantMgmtMenus) {
      const parentItem = await prisma.menuItem.create({
        data: {
          name: parent.name,
          path: undefined,
          icon: parent.icon,
          tenantId: tenant.id,
          groupId: allGroups[1].id,
        },
      });

      for (const child of parent.children) {
        await prisma.menuItem.create({
          data: {
            name: child.name,
            path: child.path,
            icon: undefined,
            tenantId: tenant.id,
            groupId: allGroups[1].id,
            parentId: parentItem.id,
          },
        });
      }
    }

    // For settings menus
    for (const parent of tenantSettingMenus) {
      const parentItem = await prisma.menuItem.create({
        data: {
          name: parent.name,
          path: undefined,
          icon: parent.icon,
          tenantId: tenant.id,
          groupId: allGroups[2].id,
        },
      });

      for (const child of parent.children) {
        await prisma.menuItem.create({
          data: {
            name: child.name,
            path: child.path,
            icon: undefined,
            tenantId: tenant.id,
            groupId: allGroups[2].id,
            parentId: parentItem.id,
          },
        });
      }
    }

    const tenantMenus = await prisma.menuItem.findMany({
      where: { tenantId: tenant.id },
    });

    for (const menu of tenantMenus) {
      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          menuId: menu.id,
          tenantId: tenant.id,
          permissionBits: 15,
        },
      });
    }

    const hashed = await bcrypt.hash(t.adminUser.password, 10);

    await prisma.user.create({
      data: {
        email: t.adminUser.email,
        password: hashed,
        isActive: true,
        tenantId: tenant.id,
        roleId: adminRole.id,
        profile: {
          create: {
            firstName: t.adminUser.firstName,
            lastName: t.adminUser.lastName,
          },
        },
      },
    });

    // Seed teachers
    for (let i = 1; i <= 2; i++) {
      await prisma.user.create({
        data: {
          email: `teacher${i}@${t.slug}.edu`,
          password: await bcrypt.hash("teacher", 10),
          isActive: true,
          tenantId: tenant.id,
          roleId: facultyRole.id,
          profile: {
            create: {
              firstName: `Teacher${i}`,
              lastName: `Test`,
            },
          },
        },
      });
    }

    // Seed students
    for (let i = 1; i <= 2; i++) {
      await prisma.user.create({
        data: {
          email: `student${i}@${t.slug}.edu`,
          password: await bcrypt.hash("student", 10),
          isActive: true,
          tenantId: tenant.id,
          roleId: studentRole.id,
          profile: {
            create: {
              firstName: `Student${i}`,
              lastName: `Test`,
            },
          },
        },
      });
    }

    console.log(`✅ Seeded tenant: ${t.name}`);
  }

  console.log("🛠️ Seeding sample widgets");
  await prisma.widget.createMany({
    data: [
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
        description: "Class schedule",
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
        description: "Assignments",
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
        description: "Notification",
        category: "communication",
      },
    ],
  });

  console.log("🎉 All data seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const defaultMaster = [
  {
    name: "Module",
    path: "/master/module",
    icon: "LayoutGrid",
  },
  { name: "Role", path: "/master/role", icon: "User2" },
  { name: "Groups", path: "/master/groups", icon: "Grid" },
];

const systemAdminMenus = [
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
];

const tenantMgmtMenus = [
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
];

const tenantSettingMenus = [
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
];