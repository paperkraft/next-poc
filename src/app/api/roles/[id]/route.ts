import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const permissions = await prisma.rolePermission.findMany({
        where: { roleId: +params.id },
        select: { menuId: true, permissionBits: true },
    });
    return Response.json(permissions);
}

export async function POST(req: Request, { params }: { params: { id: number } }) {
    const { modules } = await req.json();
    const flattened = flattenPermissions(modules);
    const session = await auth();
    const tenantId = session?.user?.tenantId;

    // upsert
    await Promise.all(
        flattened.map(({ menuId, permissionBits }) =>
            prisma.rolePermission.upsert({
                where: {
                    role_permission_tenant_unique: {
                        roleId: +params.id,
                        menuId,
                        tenantId
                    },
                },
                update: { permissionBits },
                create: { roleId: params.id, menuId, permissionBits },
            })
        )
    );

    return Response.json({ success: true });
}

function flattenPermissions(menus: any[]): { menuId: number; permissionBits: number }[] {
    return menus.flatMap((m) => [
        { menuId: m.menuId, permissionBits: m.permissionBits },
        ...flattenPermissions(m.children || []),
    ]);
}