import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash("123123", salt);

async function main() {
  // Step 1: Create some Roles

  console.log('Creating roles')

  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      permissions: 15,
    },
  });

  await prisma.role.create({
    data: {
      name: 'guest',
      permissions: 3,
    },
  });

  // Step 2: Create some Permissions
  console.log('Creating some Permissions')
  const readPermission = await prisma.permission.create({
    data: {
      name: 'Read',
      bitmask: 1,
    },
  });

  const writePermission = await prisma.permission.create({
    data: {
      name: 'Write',
      bitmask: 2,
    },
  });

  const updatePermission = await prisma.permission.create({
    data: {
      name: 'Update',
      bitmask: 3,
    },
  });

  const deletePermission = await prisma.permission.create({
    data: {
      name: 'Delete',
      bitmask: 4,
    },
  });

  // Step 3: Create some Modules
  console.log('Creating some Modules')
  const adminModule = await prisma.module.create({
    data: {
      name: 'Dashboard',
    },
  });

  await prisma.module.createMany({
    data: [
      { name: "Settings" },
      { name: "Gallery" },
      { name: "Student" },
      { name: "Role" },
      { name: "Module" },
      { name: "Academics" },
    ]
  });

  // Step 4: Create some ModulePermissions
  console.log('Creating some ModulePermissions')
  await prisma.modulePermissions.create({
    data: {
      roleId: adminRole.id,
      moduleId: adminModule.id,
      permissions: 15, // Full permissions
    },
  });

  // Step 5: Create some Users
  console.log('Creating some Users')
  await prisma.user.create({
    data: {
      firstName: 'Vishal',
      lastName: 'Sannake',
      username: 'vishal',
      name: "Vishal Sannake",
      email: 'vishal.sannake@email.com',
      password: hash,
      phone: '8888812345',
      organization: 'SV Design',
      state: 'Maharashtra',
      city: 'Kolhapur',
      roleId: adminRole.id,
    },
  });

  console.log('Data seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
