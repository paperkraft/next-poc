import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash("105105", salt);

async function main() {
  console.log("🌱 Seeding started...");

  // 1. Permissions (bitmask values)
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
  console.log("✅ Permissions seeded.");


  // 2. Roles
  console.log("🎭 Seeding roles...");
  const roles = ["super-admin", "organization-admin", "guest"];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  // 3. Groups
  console.log("📦 Seeding groups...");
  const groups = [
    { name: "Home", position: 1 },
    { name: "Master", position: 2 },
    { name: "Administrative", position: 3 },
  ];

  for (const group of groups) {
    await prisma.group.upsert({
      where: { name: group.name },
      update: { position: group.position },
      create: group,
    });
  }
  console.log("✅ Groups seeded.");


  // 4. Modules
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
  console.log("✅ Modules seeded.");


  // Fetch all groups with their IDs
  const allGroups = await prisma.group.findMany();
  const groupMap = new Map(allGroups.map((g) => [g.name, g.id]));

  // Seed modules with correct groupId
  for (const mod of modules) {
    const groupId = groupMap.get(mod.group);
    await prisma.module.upsert({
      where: { name: mod.name },
      update: {},
      create: {
        name: mod.name,
        path: mod.path,
        groupId,
      },
    });
  }
  
  // 5. Assign RolePermissions (super-admin gets full access)
  const superAdmin = await prisma.role.findUnique({
    where: { name: "super-admin" },
  });
  
  const guestRole = await prisma.role.findUnique({
    where: { name: "guest" },
  });
  
  
  console.log("🔧 Assigning role permissions...");
  if (superAdmin) {
    const allModules = await prisma.module.findMany();

    for (const mod of allModules) {
      await prisma.rolePermission.create({
        data: {
          roleId: superAdmin.id,
          moduleId: mod.id,
          permissionBits: 15,
        },
      });
    }
    console.log("✅ Super-admin permissions assigned.");
  }

  if (guestRole) {
    const dashboardModule = await prisma.module.findUnique({
      where: { name: "Dashboard" },
    });

    if (dashboardModule) {
      await prisma.rolePermission.create({
        data: {
          roleId: guestRole.id,
          moduleId: dashboardModule.id,
          permissionBits: 1,
        },
      });
    }
    console.log("✅ Guest permissions assigned.");
  }

  // 6. Create users
  console.log("👤 Creating users...");
  await prisma.user.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      email: "admin@email.com",
      password: hash,
      username: "admin",
      firstName: "Super",
      lastName: "Admin",
      roleId: superAdmin.id,
    },
  });

  // Regular user
  await prisma.user.upsert({
    where: { email: "user@email.com" },
    update: {},
    create: {
      email: "user@email.com",
      password: hash,
      username: "user",
      firstName: "Normal",
      lastName: "User",
      roleId: guestRole?.id,
    },
  });

  console.log("✅ Users created.");
  console.log("🌱 Seeding completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
