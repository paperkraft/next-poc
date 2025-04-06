import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash("123123", salt);

async function main() {
  console.log('🌱 Seeding started...');

  // // 1. Permissions (bitmask values)
  // const permissions = [
  //   { name: 'view', bitmask: 1 },
  //   { name: 'create', bitmask: 2 },
  //   { name: 'edit', bitmask: 4 },
  //   { name: 'delete', bitmask: 8 },
  // ];

  // for (const p of permissions) {
  //   await prisma.permission.upsert({
  //     where: { name: p.name },
  //     update: {},
  //     create: p,
  //   });
  // }

  // // 2. Roles
  // const roles = ['super-admin', 'organization-admin', 'editor', 'viewer'];

  // for (const role of roles) {
  //   await prisma.role.upsert({
  //     where: { name: role },
  //     update: {},
  //     create: { name: role },
  //   });
  // }

  // // 3. Groups
  // const dashboardGroup = await prisma.group.upsert({
  //   where: { name: 'Dashboard' },
  //   update: {},
  //   create: { name: 'Dashboard' },
  // });

  // // 4. Modules (nested structure)
  // const dashboardModule = await prisma.module.upsert({
  //   where: { name: 'Main Dashboard' },
  //   update: {},
  //   create: {
  //     name: 'Main Dashboard',
  //     path: '/dashboard',
  //     groupId: dashboardGroup.id,
  //   },
  // });

  // const analyticsModule = await prisma.module.upsert({
  //   where: { name: 'Analytics' },
  //   update: {},
  //   create: {
  //     name: 'Analytics',
  //     path: '/dashboard/analytics',
  //     parentId: dashboardModule.id,
  //   },
  // });

  // 5. Assign RolePermissions (super-admin gets full access)
  const superAdmin = await prisma.role.findUnique({ where: { name: 'super-admin' } });
  
  if (superAdmin) {
    await prisma.rolePermission.upsert({
      where: { roleId_moduleId: { roleId: superAdmin.id, moduleId: '67f2849eb06677abf077f8f5' } },
      update: {},
      create: {
        roleId: superAdmin.id,
        moduleId: '67f2849eb06677abf077f8f5',
        permissionBits: 15,
      },
    });

    await prisma.rolePermission.upsert({
      where: { roleId_moduleId: { roleId: superAdmin.id, moduleId: '67f28539b06677abf077f8f7' } },
      update: {},
      create: {
        roleId: superAdmin.id,
        moduleId: '67f28539b06677abf077f8f7',
        permissionBits: 15,
      },
    });

    await prisma.rolePermission.upsert({
      where: { roleId_moduleId: { roleId: superAdmin.id, moduleId: '67f28572b06677abf077f8fa' } },
      update: {},
      create: {
        roleId: superAdmin.id,
        moduleId: '67f28572b06677abf077f8fa',
        permissionBits: 15,
      },
    });
  }

  // // 6. Create a sample user
  // await prisma.user.upsert({
  //   where: { email: 'admin@example.com' },
  //   update: {},
  //   create: {
  //     email: 'admin@example.com',
  //     password: hash,
  //     username: 'admin',
  //     firstName: 'Super',
  //     lastName: 'Admin',
  //     roleId: superAdmin.id,
  //   },
  // });

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

