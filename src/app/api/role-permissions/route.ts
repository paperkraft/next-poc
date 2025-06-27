import { NextRequest, NextResponse } from 'next/server';
import { auth, unstable_update } from '@/auth';
import prisma from '@/lib/prisma';
import { logAuditAction } from '@/lib/audit-log';
import { AuditAction } from '@prisma/client';

type Payload = {
  roleId: number;
  modules: ModulePermissionInput[];
};

type ModulePermissionInput = {
  moduleId: number;
  permissions: number;
  children?: ModulePermissionInput[];
};

async function flattenModules(modules: ModulePermissionInput[]): Promise<ModulePermissionInput[]> {
  const result: ModulePermissionInput[] = [];
  const recurse = (mod: ModulePermissionInput) => {
    result.push({ moduleId: mod.moduleId, permissions: mod.permissions });
    mod.children?.forEach(recurse);
  };
  modules.forEach(recurse);
  return result;
}

export async function POST(req: NextRequest) {
  const { roleId, modules }: Payload = await req.json();
  const session = await auth();
  const tenantId = session?.user?.tenantId;

  const flatModules = await flattenModules(modules);

  // Step 1: Get current permissions from DB
  const existingPermissions = await prisma.rolePermission.findMany({
    where: { roleId: +roleId },
    select: { id: true, menuId: true },
  });

  const incomingModuleMap = new Map(flatModules.map(m => [m.moduleId, m.permissions]));
  const existingModuleMap = new Map(existingPermissions.map(p => [p.menuId, p.id]));

  const upserts = [];
  const deletes = [];

  // Step 2: Handle upserts
  for (const mod of flatModules) {
    const existingId = existingModuleMap.get(mod.moduleId);
    if (mod.permissions > 0) {
      upserts.push(
        prisma.rolePermission.upsert({
          where: { tenantId_roleId_menuId: { roleId, menuId: mod.moduleId, tenantId } },

          update: { permissionBits: mod.permissions },
          create: {
            roleId,
            menuId: mod.moduleId,
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
  const data = await prisma.$transaction([...upserts, ...deletes]);

  // Step 5: Update session

  await unstable_update({ ...session?.user });

  await logAuditAction({
    action: AuditAction.UPDATE,
    entity: 'RBAC',
    details: { data: data }
  });

  return NextResponse.json({ success: true });
}
