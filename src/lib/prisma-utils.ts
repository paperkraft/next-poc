import prisma from "./prisma";

export const createPermissions = async () => {
  await prisma.permission.createMany({
    data: [
      { name: "VIEW", bitmask: 1 },
      { name: "CREATE", bitmask: 2 },
      { name: "EDIT", bitmask: 4 },
      { name: "DELETE", bitmask: 8 }
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

export const createModule = async () => {
  return true
  // const settingsModule = await prisma.module.create({
  //   data: {
  //     name: 'Settings',
  //     permissions: {
  //       create: [
  //         { name: "VIEW", bitmask: 1 },
  //         { name: "CREATE", bitmask: 2 },
  //         { name: "EDIT", bitmask: 4 },
  //         { name: "DELETE", bitmask: 8 }
  //       ],
  //     },
  //   }
  // });

  // return await prisma.subModule.create({
  //   data: {
  //     name: 'Account',
  //     moduleId: settingsModule.id
  //   }
  // });


  // return await prisma.user.update({
  //   where: { email: "vishal.sannake@akronsystems.com" },
  //   data: {
  //     ModulePermissions: {
  //       create: [
  //         {
  //           moduleId: "6737366a447fecf5185dead7",
  //           permissions: 15,
  //         },
  //         {
  //           moduleId: "6737366a447fecf5185dead7",
  //           submoduleId: "6737366a447fecf5185deadc",
  //           permissions: 15,
  //         },
  //       ],
  //     },
  //   },
  // });
}