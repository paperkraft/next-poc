import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const roleId = Number(params.id);

    const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: { tenant: true },
    });

    if (!role) {
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const menuItems = await prisma.menuItem.findMany({
        where: { tenantId: role.tenantId },
        include: {
            group: true,
            children: {
                include: {
                    group: true,
                    rolePermission: { where: { roleId } },
                    children: {
                        include: {
                            group: true,
                            rolePermission: { where: { roleId } },
                            children: {
                                include: {
                                    group: true,
                                    rolePermission: { where: { roleId } },
                                },
                            },
                        },
                    },
                },
            },
            rolePermission: { where: { roleId } },
        },
    });

    function formatMenu(item: any): any {
        return {
            id: item.id,
            name: item.name,
            group: item.group ? { name: item.group.name } : null,
            permissionBits: item.rolePermission[0]?.permissionBits || 0,
            parentId: item.parentId,
            children: item.children?.map(formatMenu) || [],
        };
    }

    // Return only root-level menus
    const topLevel = menuItems.filter((item) => !item.parentId);
    const formatted = topLevel.map(formatMenu);

    return NextResponse.json(formatted);
}
