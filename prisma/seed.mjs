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
  await prisma.permission.createMany({
    data:[
      {
        name: 'Read',
        bitmask: 1,
      },
      {
        name: 'Write',
        bitmask: 2,
      },
      {
        name: 'Update',
        bitmask: 3,
      },
      {
        name: 'Delete',
        bitmask: 4,
      },
    ]
  });

  // Create groups

  await prisma.group.createMany({
    data: [
      { name: "Home" },
      { name: "Master" },
      { name: "Global Master" },
      { name: "Module" },
      { name: "Picture" },
      { name: "Uncategorized" },
    ]
  });
  // Fetch the groups to get their IDs since createMany doesn't return created records
  const groupList = await prisma.group.findMany();
 
  // Step 3: Create some Modules
  console.log('Creating some Modules')
  const adminModule = await prisma.module.create({
    data: {
      groupId: groupList[0].id,
      name: 'Dashboard',
    },
  });

  await prisma.module.createMany({
    data: [
      { name: "Settings", groupId: groupList[0].id },
      { name: "Gallery", groupId: groupList[4].id },
      { name: "Role", groupId: groupList[1].id },
      { name: "Module", groupId: groupList[1].id },
      { name: "Academics", groupId: groupList[3].id },
      { name: "Student", groupId: groupList[3].id },
    ]
  });

  // Step 4: Create some ModulePermissions
  console.log('Creating some ModulePermissions')
  await prisma.modulePermission.create({
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
      // name: 'Vishal Sannake',
      email: 'vishal.sannake@akronsystems.com',
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
