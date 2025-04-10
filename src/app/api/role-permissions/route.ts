import { NextRequest, NextResponse } from 'next/server';
import { auth, unstable_update } from '@/auth';
import prisma from '@/lib/prisma';

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

  // Step 5: Update session
  const session = await auth();
  await unstable_update({ ...session?.user });

  return NextResponse.json({ success: true });
}
