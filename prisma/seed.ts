// import prisma from "@/lib/prisma";
// import { makePassword } from "@/utils/password";
// const { makePassword } = require("@/utils/password")
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// import { PrismaClient } from "@prisma/client";

// Initialize the Prisma Client
// const prisma = new PrismaClient();

// Permissions: Define the permissions and their corresponding bit values
const permissions = [
  { name: "VIEW", bit: 1 },
  { name: "CREATE", bit: 2 },
  { name: "EDIT", bit: 4 },
  { name: "DELETE", bit: 8 },
];

async function main() {
  // Seed Permissions
  console.log("Seeding Permissions...");
  await prisma.permission.createMany({
    data: permissions,
  });

  // Seed Roles
  console.log("Seeding Roles...");
  const adminPermissions = 1 | 2 | 4 | 8; // Full access
  const userPermissions = 1 | 2; // Limited permissions

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      permissions: adminPermissions,
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "User",
      permissions: userPermissions,
    },
  });

  // Seed Users (with roles assigned)
  console.log("Seeding Users...");
  await prisma.user.createMany({
    data: [
      {
        username:"admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        // password: await makePassword("admin123"),
        password: "admin123",
        roleId: adminRole.id,
      },
      {
        username:"user",
        firstName: "Regular",
        lastName: "User",
        email: "user@example.com",
        // password: await makePassword("user123"),
        password: "user123",
        roleId: userRole.id,
      },
    ],
    // skipDuplicates: true,
  });

  console.log("Seeding completed.");
}

// Run the seeding function
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
