import { BillingCycle, PrismaClient, TenantType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Masters, SystemAdminMenus, TenantMenus, Widgets } from "./menus";

const prisma = new PrismaClient();

type scetionKey = "management" | "settings";

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
  await prisma.widget.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.addOnItem.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();

  console.log("✅ Database cleared.");

  console.log("🎭 Seeding Super Admin role...");
  const superAdminRole = await prisma.role.create({
    data: {
      name: "Super Admin",
      tenantId: null,
      isSystem: true,
    },
  });

  const groupNamesMap = new Map<string, number>();

  console.log("📁 Seeding System Admin menu group...");
  const sysAdminGroups = [
    { name: "System Administration", position: 1 },
    { name: "Master", position: 2 },
  ];

  for (const g of sysAdminGroups) {
    const group = await prisma.menuGroup.create({
      data: {
        name: g.name,
        sortOrder: g.position,
        tenantId: null,
        isSystem: true,
      },
    });

    groupNamesMap.set(g.name, group.id)
  }

  console.log("🛠️ Seeding System default Master menus...");

  // Helper: recursively create menu items with hierarchy
  async function createMenuItems(
    items: typeof SystemAdminMenus | typeof Masters[number]["children"],
    parentId: number | null,
    groupId: number,
    tenantId?: number // null implies system-wide menus
  ) {
    for (const item of items) {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          path: "path" in item ? item.path : undefined,
          icon: "icon" in item ? item.icon : undefined,
          parentId: parentId ?? undefined,
          groupId,
          tenantId: tenantId ?? null,
          isActive: true,
          isSystem: tenantId == null,
        },
      });

      if ("children" in item && item.children.length > 0) {
        await createMenuItems(item.children, menuItem.id, groupId, tenantId);
      }
    }
  }

  console.log("🛠️ Seeding System Admin menus...");

  // Seed SystemAdminMenus into "System Administration" group
  const systemAdminGroupId = groupNamesMap.get("System Administration");
  if (systemAdminGroupId) {
    await createMenuItems(SystemAdminMenus, null, systemAdminGroupId);
  }

  // Seed Masters into "Master" group
  const masterGroupId = groupNamesMap.get("Master");
  if (masterGroupId) {
    await createMenuItems(Masters, null, masterGroupId);
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
      userScope: "SYSTEM",
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

  // Create Subscription Plans with included menu items
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      name: "Basic",
      description: "Basic plan with dashboard access",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      isActive: true,
      menuItems: {
        connect: [{ id: systemMenus[0].id }],
      },
    },
  });

  const standardPlan = await prisma.subscriptionPlan.create({
    data: {
      name: "Standard",
      description: "Standard plan with dashboard and reports",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      isActive: true,
      menuItems: {
        connect: [{ id: systemMenus[0].id }],
      },
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: "Premium",
      description: "Premium plan with all features",
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      isActive: true,
      menuItems: {
        connect: [{ id: systemMenus[0].id }],
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
      subscriptionPlanId: basicPlan.id,
      billingCycle: BillingCycle.MONTHLY
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
      subscriptionPlanId: premiumPlan.id,
      billingCycle: BillingCycle.ANNUALLY
    },
  ];

  for (const t of sampleTenants) {
    const tenant = await prisma.tenant.create({
      data: {
        name: t.name,
        slug: t.slug,
        description: `${t.name} is a reputed educational institute.`,
        type: t.type as TenantType,
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
        subscription: {
          create: {
            subscriptionPlanId: t.subscriptionPlanId,
            billingCycle: t.billingCycle,
            startDate: new Date(),
            isTrial: false,
            autoRenew: true,
          },
        },
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

    const groups = [
      { name: "Home", position: 1 },
      { name: "Management", position: 2 },
      { name: "Settings", position: 3 },
    ];

    for (const g of groups) {
      await prisma.menuGroup.create({
        data: {
          name: g.name,
          sortOrder: g.position,
          tenantId: tenant.id,
        },
      });
    }

    const allGroups = await prisma.menuGroup.findMany({
      where: { tenantId: tenant.id },
    });

    const groupMap = Object.fromEntries(
      allGroups.map((group) => [group.name, group.id])
    );

    // home
    await prisma.menuItem.create({
      data: {
        name: "Dashboard",
        path: "/dashboard",
        icon: "BarChart3",
        groupId: groupMap["Home"],
        tenantId: tenant.id,
      },
    });

    for (const section of TenantMenus) {
      for (const key of Object.keys(section)) {
        const groupName = key.charAt(0).toUpperCase() + key.slice(1);
        const groupId = groupMap[groupName];
        const menuGroups = section[key as scetionKey];
        if (menuGroups) await createMenuItems(menuGroups, null, groupId, tenant.id);
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

  for (const w of Widgets) {
    await prisma.widget.create({
      data: {
        name: w.name,
        key: w.key,
        component: w.component,
        description: w.description,
        category: w.category,
      },
    });
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