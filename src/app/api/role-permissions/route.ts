import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { AuditAction } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { roleId, tenantId, permissions } = body;

    // permissions: Array<{ menuId: number, permissionBits: number }> 

    try {
        for (const { menuId, permissionBits } of permissions) {
            if (permissionBits === 0) {
                // DELETE if exists
                await prisma.rolePermission.deleteMany({
                    where: {
                        roleId,
                        menuId,
                        tenantId,
                    },
                });
            } else {
                // UPSERT at role_permission_tenant_unique
                await prisma.rolePermission.upsert({
                    where: {
                        role_permission_tenant_unique: { roleId, menuId, tenantId },
                    },
                    update: { permissionBits },
                    create: { roleId, menuId, tenantId, permissionBits },
                });
            }
        }

        await logAuditAction({
            action: AuditAction.UPDATE,
            entity: 'RBAC',
            details: { data: permissions }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving role permissions:", error);
        return NextResponse.json({ error: "Failed to save permissions" }, { status: 500 });
    }
}