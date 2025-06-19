import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const permissions = await prisma.rolePermission.findMany({
        where: { roleId: params.id },
        select: { moduleId: true, permissionBits: true },
    });
    return Response.json(permissions);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { modules } = await req.json();
    const flattened = flattenPermissions(modules);
    const session = await auth();
    const tenantId = session?.user?.tenantId;

    // upsert
    await Promise.all(
        flattened.map(({ moduleId, permissionBits }) =>
            prisma.rolePermission.upsert({
                where: {
                    tenantId_roleId_moduleId: {
                        roleId: params.id,
                        moduleId,
                        tenantId
                    },
                },
                update: { permissionBits },
                create: { roleId: params.id, moduleId, permissionBits },
            })
        )
    );

    return Response.json({ success: true });
}

function flattenPermissions(modules: any[]): { moduleId: string; permissionBits: number }[] {
    return modules.flatMap((m) => [
        { moduleId: m.moduleId, permissionBits: m.permissionBits },
        ...flattenPermissions(m.children || []),
    ]);
}