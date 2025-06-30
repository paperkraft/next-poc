import { GlobalRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing data...");

  // Order matters (due to relations)
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

  console.log("🏫 Seeding default tenant (school)...");
  const tenant = await prisma.tenant.create({
    data: {
      name: "Sunrise Public School",
      description: "A leading educational institution",
      slug: "sunrise",
      type: "SCHOOL",
      address: {
        street: "123 Education Lane",
        city: "Kolhapur",
        state: "Maharashtra",
        zipCode: "416001",
        country: "India",
      },
      contact: {
        phone: "+91-9876543210",
        email: "info@sunrisepublicschool.edu",
        website: "https://sunrisepublicschool.edu",
      },
      settings: {
        timezone: "America/Los_Angeles",
        academicYear: "2024-2025",
      },
      limits: {
        maxUsers: 1000,
        maxStorage: "10GB",
      },
      branding: {
        primaryColor: "#2E7D32",
        secondaryColor: "#66BB6A",
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

  console.log("🔐 Seeding permissions...");
  for (const perm of permissions) {
    await prisma.permission.create({
      data: {
        ...perm,
        tenantId: tenant.id,
      },
    });
  }

  console.log("🎭 Seeding roles...");
  const roles = await prisma.$transaction([
    prisma.role.create({
      data: {
        name: "Super Admin",
        tenantId: null,
      },
    }),
    prisma.role.create({
      data: {
        name: "Admin",
        tenantId: tenant.id,
      },
    }),
    prisma.role.create({
      data: {
        name: "Faculty",
        tenantId: tenant.id,
      },
    }),
    prisma.role.create({
      data: {
        name: "Student",
        tenantId: tenant.id,
      },
    }),
  ]);

  const superAdminRole = await prisma.role.findFirst({
    where: { name: "Super Admin" },
  });

  const orgAdminRole = await prisma.role.findFirst({
    where: { name: "Admin" },
  });

  const facultyRole = await prisma.role.findFirst({
    where: { name: "Faculty" },
  });

  const studentRole = await prisma.role.findFirst({
    where: { name: "Student" },
  });

  console.log("📦 Seeding groups...");
  const menuGroups = await prisma.menuGroup.createMany({
    data: [
      { name: "Home", tenantId: tenant.id, position: 1 },
      { name: "Master", tenantId: tenant.id, position: 2 },
      { name: "Administrative", tenantId: tenant.id, position: 3 },
    ],
  });

  const allGroups = await prisma.menuGroup.findMany({
    where: { tenantId: tenant.id },
  });

  const groupMap = new Map(allGroups.map((g) => [g.name, g.id]));

  console.log("📁 Seeding menus...");

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", group: "Home", icon: "Home" },
    { name: "Module", path: "/master/module", group: "Master", icon: "LayoutGrid" },
    { name: "Role", path: "/master/role", group: "Master", icon: "User2" },
    { name: "Groups", path: "/master/groups", group: "Master", icon: "Grid" },
    { name: "RBAC", path: "/administrative/rbac", group: "Administrative", icon: "Shield" },
    {
      name: "Audit Logs",
      path: "/administrative/audit-logs",
      group: "Administrative",
      icon: "Logs"
    },
  ];

  for (const mod of menuItems) {
    await prisma.menuItem.create({
      data: {
        name: mod.name,
        path: mod.path,
        icon: mod.icon,
        groupId: groupMap.get(mod.group),
        tenantId: tenant.id,
      },
    });
  }

  const allMenus = await prisma.menuItem.findMany({
    where: { tenantId: tenant.id },
  });

  console.log("🔧 Assigning role permissions...");

  // Assign full permission (1|2|4|8 = 15) to Admin role for all menu items
  for (const menu of allMenus) {
    await prisma.rolePermission.create({
      data: {
        roleId: orgAdminRole.id,
        tenantId: tenant.id,
        menuId: menu.id,
        permissionBits: 15,
      },
    });

    // Teachers: only view and update
    if (menu.name === "Dashboard" || menu.name === "Module") {
      await prisma.rolePermission.create({
        data: {
          roleId: facultyRole.id,
          tenantId: tenant.id,
          menuId: menu.id,
          permissionBits: 1 | 4,
        },
      });
    }

    // Students: view only
    if (menu.name === "Dashboard") {
      await prisma.rolePermission.create({
        data: {
          roleId: studentRole.id,
          tenantId: tenant.id,
          menuId: menu.id,
          permissionBits: 1,
        },
      });
    }
  }

  // Global access for super-admin to all tenant modules
  for (const menu of allMenus) {
    await prisma.rolePermission.create({
      data: {
        roleId: superAdminRole.id,
        menuId: menu.id,
        tenantId: null,
        permissionBits: 15,
      },
    });
  }

  const hashedPassword = await bcrypt.hash("123123", 10);

  console.log("👤 Creating users...");

  await prisma.user.create({
    data: {
      email: "superadmin@email.com",
      password: hashedPassword,
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

  const tenantUsers = [
    {
      email: "admin@sunrise.edu",
      password: "admin",
      roleName: "Admin",
      firstName: "Amit",
      lastName: "Singh",
    },
    {
      email: "teacher@sunrise.edu",
      password: "teacher",
      roleName: "Faculty",
      firstName: "Rina",
      lastName: "Kumar",
    },
    {
      email: "student@sunrise.edu",
      password: "student",
      roleName: "Student",
      firstName: "Rahul",
      lastName: "Verma",
    },
  ];

  for (const u of tenantUsers) {
    const role = roles.find((r) => r.name === u.roleName);
    const hashed = await bcrypt.hash(u.password, 10);

    await prisma.user.create({
      data: {
        email: u.email,
        password: hashed,
        tenantId: tenant.id,
        isActive: true,
        roleId: role.id,
        profile: {
          create: {
            firstName: u.firstName,
            lastName: u.lastName,
          },
        },
      },
    });
  }

  console.log("✅ Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
