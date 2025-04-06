import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// type Payload = {
//   roleId: string;
//   modules: {
//     moduleId: string;
//     permissions: number;
//     subModules?: Payload['modules'];
//   }[];
// };

// function flattenModules(modules: Payload['modules']) {
//   const result: { moduleId: string; permissions: number }[] = [];
//   for (const mod of modules) {
//     result.push({ moduleId: mod.moduleId, permissions: mod.permissions });
//     if (mod.subModules && mod.subModules.length > 0) {
//       result.push(...flattenModules(mod.subModules));
//     }
//   }
//   return result;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = (await req.json()) as Payload;

//     const flattened = flattenModules(body.modules);

//     await Promise.all(
//       flattened.map((entry) =>
//         prisma.rolePermission.upsert({
//           where: {
//             roleId_moduleId: {
//               roleId: body.roleId,
//               moduleId: entry.moduleId,
//             },
//           },
//           update: {
//             permissionBits: entry.permissions,
//           },
//           create: {
//             roleId: body.roleId,
//             moduleId: entry.moduleId,
//             permissionBits: entry.permissions,
//           },
//         })
//       )
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: 'Failed to update permissions.' }, { status: 500 });
//   }
// }



// POST /api/role-permissions


// export async function POST(req: Request) {
//   const body = await req.json();
//   const { roleId, modules } = body;

//   if (!roleId || !Array.isArray(modules)) {
//     return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//   }

//   const flattenModules = (mods: any[]): { moduleId: string; permissionBits: number }[] => {
//     const result: any[] = [];

//     for (const mod of mods) {
//       result.push({ moduleId: mod.moduleId, permissionBits: mod.permissions });
//       if (mod.subModules?.length) {
//         result.push(...flattenModules(mod.subModules));
//       }
//     }

//     return result;
//   };

//   const flattened = flattenModules(modules);

//   await Promise.all(
//     flattened.map(async ({ moduleId, permissionBits }) => {
//       if (permissionBits === 0) {
//         await prisma.rolePermission.deleteMany({
//           where: { roleId, moduleId },
//         });
//       } else {
//         await prisma.rolePermission.upsert({
//           where: {
//             roleId_moduleId: {
//               roleId,
//               moduleId,
//             },
//           },
//           update: { permissionBits },
//           create: { roleId, moduleId, permissionBits },
//         });
//       }
//     })
//   );

//   return NextResponse.json({ message: "Permissions updated." });
// }



type Payload = {
  roleId: string;
  modules: ModulePermissionInput[];
};

type ModulePermissionInput = {
  moduleId: string;
  permissions: number;
  subModules?: ModulePermissionInput[];
};

async function flattenModules(modules: ModulePermissionInput[]): Promise<ModulePermissionInput[]> {
  const result: ModulePermissionInput[] = [];
  const recurse = (mod: ModulePermissionInput) => {
    result.push({ moduleId: mod.moduleId, permissions: mod.permissions });
    mod.subModules?.forEach(recurse);
  };
  modules.forEach(recurse);
  return result;
}

export async function POST(req: NextRequest) {
  const { roleId, modules }: Payload = await req.json();

  const flatModules = await flattenModules(modules);

  // Step 1: Get current permissions from DB
  const existingPermissions = await prisma.rolePermission.findMany({
    where: { roleId },
    select: { id: true, moduleId: true },
  });

  const incomingModuleMap = new Map(flatModules.map(m => [m.moduleId, m.permissions]));
  const existingModuleMap = new Map(existingPermissions.map(p => [p.moduleId, p.id]));

  const upserts = [];
  const deletes = [];

  // Step 2: Handle upserts
  for (const mod of flatModules) {
    const existingId = existingModuleMap.get(mod.moduleId);
    if (mod.permissions > 0) {
      upserts.push(
        prisma.rolePermission.upsert({
          where: { roleId_moduleId: { roleId, moduleId: mod.moduleId } },
          update: { permissionBits: mod.permissions },
          create: {
            roleId,
            moduleId: mod.moduleId,
            permissionBits: mod.permissions,
          },
        })
      );
    } else if (existingId) {
      // If permissionBits is 0, delete this record
      deletes.push(prisma.rolePermission.delete({ where: { id: existingId } }));
    }
  }

  // Step 3: Delete missing modules (i.e. removed ones not even sent)
  for (const [existingModuleId, id] of existingModuleMap.entries()) {
    if (!incomingModuleMap.has(existingModuleId)) {
      deletes.push(prisma.rolePermission.delete({ where: { id } }));
    }
  }

  // Step 4: Execute
  await prisma.$transaction([...upserts, ...deletes]);

  return NextResponse.json({ success: true });
}
