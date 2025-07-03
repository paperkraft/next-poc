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

  console.log("✅ Database cleared.");

  console.log("🎭 Seeding Super Admin role...");
  const superAdminRole = await prisma.role.create({
    data: {
      name: "Super Admin",
      tenantId: null,
    },
  });

  console.log("📁 Seeding System Admin menu group...");
  const sysAdminGroup = await prisma.menuGroup.create({
    data: {
      name: "System Administration",
      tenantId: null,
      position: 1,
    },
  });

  const sysAdminMasterGroup = await prisma.menuGroup.create({
    data: {
      name: "Master",
      tenantId: null,
      position: 2,
    },
  });

  const systemAdminMenus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "BarChart3",
      children: [],
    },
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
  ];

  const defaultMaster = [
    {
      name: "Module",
      path: "/master/module",
      icon: "LayoutGrid",
    },
    { name: "Role", path: "/master/role", icon: "User2" },
    { name: "Groups", path: "/master/groups", icon: "Grid" },
  ];

  console.log("🛠️ Seeding System default Master menus...");

  for (const mod of defaultMaster) {
    await prisma.menuItem.create({
      data: {
        name: mod.name,
        path: mod.path,
        icon: mod.icon,
        groupId: sysAdminMasterGroup.id,
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
        groupId: sysAdminGroup.id,
      },
    });

    for (const child of parent.children) {
      await prisma.menuItem.create({
        data: {
          name: child.name,
          path: child.path,
          icon: undefined,
          tenantId: null,
          groupId: sysAdminGroup.id,
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
      adminUser: {
        email: "admin@sunrise.edu",
        password: "admin123",
        firstName: "Amit",
        lastName: "Singh",
      },
    },
    {
      name: "Green Valley Academy",
      slug: "greenvalley",
      email: "admin@greenvalley.edu",
      city: "Pune",
      adminUser: {
        email: "admin@greenvalley.edu",
        password: "admin123",
        firstName: "Neha",
        lastName: "Patil",
      },
    },
    {
      name: "Blue Ridge High",
      slug: "blueridge",
      email: "admin@blueridge.edu",
      city: "Mumbai",
      adminUser: {
        email: "admin@blueridge.edu",
        password: "admin123",
        firstName: "Raj",
        lastName: "Kapoor",
      },
    },
  ];

  for (const t of sampleTenants) {
    const tenant = await prisma.tenant.create({
      data: {
        name: t.name,
        slug: t.slug,
        description: `${t.name} is a reputed educational institute.`,
        type: "SCHOOL",
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

    const groups = await prisma.menuGroup.createMany({
      data: [
        { name: "Home", tenantId: tenant.id, position: 1 },
        { name: "Master", tenantId: tenant.id, position: 2 },
      ],
    });

    const menuGroups = await prisma.menuGroup.findMany({
      where: { tenantId: tenant.id },
    });

    const groupMap = new Map(menuGroups.map((g) => [g.name, g.id]));

    const tenantMenus = [
      { name: "Dashboard", path: "/dashboard", group: "Home", icon: "Home" },
      {
        name: "Module",
        path: "/master/module",
        group: "Master",
        icon: "LayoutGrid",
      },
      { name: "Role", path: "/master/role", group: "Master", icon: "User2" },
      { name: "Groups", path: "/master/groups", group: "Master", icon: "Grid" },
    ];

    const insertedMenus = [];
    for (const mod of tenantMenus) {
      const menu = await prisma.menuItem.create({
        data: {
          name: mod.name,
          path: mod.path,
          icon: mod.icon,
          groupId: groupMap.get(mod.group),
          tenantId: tenant.id,
        },
      });
      insertedMenus.push(menu);
    }

    for (const menu of insertedMenus) {
      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          tenantId: tenant.id,
          menuId: menu.id,
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

    // ➕ Seed fake teachers
    for (let i = 1; i <= 3; i++) {
      await prisma.user.create({
        data: {
          email: `teacher${i}@${t.slug}.edu`,
          password: await bcrypt.hash("teacher123", 10),
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

    // ➕ Seed fake students
    for (let i = 1; i <= 5; i++) {
      await prisma.user.create({
        data: {
          email: `student${i}@${t.slug}.edu`,
          password: await bcrypt.hash("student123", 10),
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
