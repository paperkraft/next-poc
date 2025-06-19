import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing data...");

  // Order matters (due to relations)
  await prisma.notification.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.module.deleteMany();
  await prisma.group.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.tenant.deleteMany();

  console.log("✅ Database cleared.");

  console.log("🏫 Seeding default tenant (school)...");
  const tenant = await prisma.tenant.create({
    data: {
      name: "Green Valley School",
      type: "SCHOOL",
      code: "GVS001",
    },
  });

  console.log("🔐 Seeding permissions...");
  const permissions = [
    { name: "view", bitmask: 1 },
    { name: "create", bitmask: 2 },
    { name: "edit", bitmask: 4 },
    { name: "delete", bitmask: 8 },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log("🎭 Seeding roles...");
  const roles = [
    { name: "super-admin", tenantId: null }, // global
    { name: "organization-admin", tenantId: tenant.id },
    { name: "guest", tenantId: tenant.id },
  ];

  for (const role of roles) {
    await prisma.role.create({ data: role });
  }

  const superAdminRole = await prisma.role.findFirst({
    where: { name: "super-admin" },
  });
  const orgAdminRole = await prisma.role.findFirst({
    where: { name: "organization-admin" },
  });
  const guestRole = await prisma.role.findFirst({ where: { name: "guest" } });

  console.log("📦 Seeding groups...");
  const groups = [
    { name: "Home", position: 1, tenantId: tenant.id },
    { name: "Master", position: 2, tenantId: tenant.id },
    { name: "Administrative", position: 3, tenantId: tenant.id },
  ];

  for (const group of groups) {
    await prisma.group.create({ data: group });
  }

  const allGroups = await prisma.group.findMany({
    where: { tenantId: tenant.id },
  });

  const groupMap = new Map(allGroups.map((g) => [g.name, g.id]));

  console.log("📁 Seeding modules...");
  
  const modules = [
    { name: "Dashboard", path: "/dashboard", group: "Home" },
    { name: "Module", path: "/master/module", group: "Master" },
    { name: "Role", path: "/master/role", group: "Master" },
    { name: "Groups", path: "/master/groups", group: "Master" },
    { name: "RBAC", path: "/administrative/rbac", group: "Administrative" },
    {
      name: "Audit Logs",
      path: "/administrative/audit-logs",
      group: "Administrative",
    },
  ];

  for (const mod of modules) {
    await prisma.module.create({
      data: {
        name: mod.name,
        path: mod.path,
        groupId: groupMap.get(mod.group),
        tenantId: tenant.id,
      },
    });
  }

  const allModules = await prisma.module.findMany({
    where: { tenantId: tenant.id },
  });

  console.log("🔧 Assigning role permissions...");
  for (const mod of allModules) {
    // Full access to organization-admin
    await prisma.rolePermission.create({
      data: {
        roleId: orgAdminRole.id,
        moduleId: mod.id,
        tenantId: tenant.id,
        permissionBits: 15,
      },
    });

    // Guest: view-only for dashboard
    if (mod.name === "Dashboard") {
      await prisma.rolePermission.create({
        data: {
          roleId: guestRole.id,
          moduleId: mod.id,
          tenantId: tenant.id,
          permissionBits: 1,
        },
      });
    }
  }

  // Global access for super-admin to all tenant modules
  for (const mod of allModules) {
    await prisma.rolePermission.create({
      data: {
        roleId: superAdminRole.id,
        moduleId: mod.id,
        tenantId: tenant.id,
        permissionBits: 15,
      },
    });
  }

  console.log("👤 Creating users...");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("105105", salt);

  await prisma.user.create({
    data: {
      email: "superadmin@email.com",
      username: "super",
      password: hash,
      firstName: "Super",
      lastName: "Admin",
      roleId: superAdminRole.id,
      isActive: true,
      isSuperAdmin: true,
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@email.com",
      username: "admin",
      password: hash,
      firstName: "Org",
      lastName: "Admin",
      roleId: orgAdminRole.id,
      isActive: true,
      tenantId: tenant.id,
    },
  });

  console.log("🌱 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
