import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roleId = searchParams.get("roleId");

  if (!roleId) {
    return NextResponse.json({ error: "Missing roleId" }, { status: 400 });
  }

  // Fetch all modules and role permissions
  const [modules, rolePermissions] = await Promise.all([
    prisma.module.findMany({
      include: { group: true }
    }),
    prisma.rolePermission.findMany({
      where: { roleId },
    }),
  ]);

  const permissionMap = new Map<string, number>();
  rolePermissions.forEach((rp) => {
    permissionMap.set(rp.moduleId, rp.permissionBits);
  });

  // Attach permissions and build id map
  const moduleMap = new Map<string, any>();
  modules.forEach((mod) => {
    moduleMap.set(mod.id, {
      id: mod.id,
      name: mod.name,
      parentId: mod.parentId,
      groupId: mod.group?.id,
      groupName: mod.group?.name,
      position: mod.group?.position,
      permissions: permissionMap.get(mod.id) || 0,
      subModules: [],
    });
  });

  // Build hierarchy
  const rootModules: any[] = [];
  moduleMap.forEach((mod) => {
    if (mod.parentId && moduleMap.has(mod.parentId)) {
      moduleMap.get(mod.parentId).subModules.push(mod);
    } else {
      rootModules.push(mod);
    }
  });

  return NextResponse.json(rootModules);
}
