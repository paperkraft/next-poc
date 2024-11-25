import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      createdBy: null,
    },
  });

  const editorRole = await prisma.role.create({
    data: {
      name: 'Editor',
      createdBy: null,
    },
  });

  console.log('Roles seeded:', { adminRole, editorRole });

  // 2. Seed Modules
  const userManagementModule = await prisma.module.create({
    data: {
      name: 'User Management',
      createdBy: null,
    },
  });

  const contentManagementModule = await prisma.module.create({
    data: {
      name: 'Content Management',
      createdBy: null,
    },
  });

  console.log('Modules seeded:', { userManagementModule, contentManagementModule });

  // 3. Seed Submodules (Optional)
  const userRolesSubModule = await prisma.module.create({
    data: {
      name: 'Manage Roles',
      parentId: userManagementModule.id,
      createdBy: null,
    },
  });

  console.log('Submodules seeded:', { userRolesSubModule });

  // 4. Seed ModulePermissions
  const adminPermissions = await prisma.modulePermission.create({
    data: {
      moduleId: userManagementModule.id,
      roleId: adminRole.id,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canManage: true,
      createdBy: null,
    },
  });

  const editorPermissions = await prisma.modulePermission.create({
    data: {
      moduleId: contentManagementModule.id,
      roleId: editorRole.id,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManage: false,
      createdBy: null,
    },
  });

  console.log('Permissions seeded:', { adminPermissions, editorPermissions });

  // 5. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin@example.com',
      password: 'securepassword', // Ideally hashed in a real-world scenario
      roleId: adminRole.id,
      createdBy: null,
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'editor@example.com',
      password: 'securepassword', // Ideally hashed in a real-world scenario
      roleId: editorRole.id,
      createdBy: null,
    },
  });

  console.log('Users seeded:', { adminUser, editorUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
