import prisma from "./prisma";

export const createPermissions = async () => {
  await prisma.permission.createMany({
    data: [
      { name: "VIEW", bit: 1 },
      { name: "CREATE", bit: 2 },
      { name: "EDIT", bit: 4 },
      { name: "DELETE", bit: 8 }
    ],
  });
};

export const createRole = async (roleName: string, permissions: number) => {
  return await prisma.role.create({
    data: {
      name: roleName,
      permissions,
    },
  });
};
