import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
    params: { id: number };
}

type ModuleInput = {
    id?: number;
    name: string;
    path?: string;
    groupId?: string;
    children?: ModuleInput[];
};

const maxDepth = 2; // Maximum depth allowed for modules

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const module = await prisma.menuItem.findUnique({
            where: { id: params.id },
            include: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        path: true,
                    },
                },
            },
        });

        if (!module) {
            return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
        }

        const finalModule = {
            id: module.id,
            name: module.name,
            path: module.path,
            groupId: module.groupId,
            children: module.children,
        }

        return NextResponse.json({ success: true, data: finalModule });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch module' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const body = await req.json();
        const { name, path, groupId, children = [] } = body;

        const url = path === "" ? undefined : path.startsWith('/') ? path : path.startsWith('#') ? undefined : `/${path}`;

        // Step 1: Update parent module
        await prisma.menuItem.update({
            where: { id: +params.id },
            data: { name, path: url, groupId: groupId ? +groupId : undefined, isActive: true },
        });

        // Step 2: Recursive handler to sync children
        await syncChildren(children, params.id);

        return NextResponse.json({ success: true, message: 'Module and children updated successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to update module' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({
            success: false,
            message: 'Module ID is required [id]'
        }, { status: 400 });
    }

    try {
        // Collect all IDs in the hierarchy
        await deleteModuleAndDescendants(+id);

        revalidatePath('/master/module');

        return NextResponse.json({ success: true, message: "Module and children deleted" });
    } catch (err: any) {
        console.error('Delete module error:', err);
        // If custom error thrown from the delete function
        if (err?.code === 'ASSIGNED_MODULE') {
            return NextResponse.json(
                {
                    success: false,
                    message: err.message,
                    assigned: err.assigned,
                },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: false, message: 'Failed to delete module' }, { status: 500 });
    }
}


async function syncChildren(children: ModuleInput[], parentId: number, depth: number = 1) {

    if (depth > maxDepth) {
        throw new ModuleDepthError(depth);
    }

    const existingChildren = await prisma.menuItem.findMany({
        where: { parentId: +parentId },
        select: { id: true },
    });

    const existingIds = existingChildren.map((c) => c.id);
    const submittedIds = children.map((c) => c.id).filter(Boolean);

    // Delete removed children
    const childrenToDelete = existingIds.filter((id) => !submittedIds.includes(id));

    // 1. Recursively delete removed children and descendants in parallel
    await Promise.all(
        childrenToDelete.map((id) => deleteModuleAndDescendants(id))
    );

    // 2. Prepare all updates/creates in parallel
    await Promise.all(
        children.map(async (child) => {
            const childUrl = child.path === "" ? "#" : child.path?.startsWith('/') ? child.path : child.path?.startsWith('#') ? undefined : `/${child.path}`;
            const groupId = child.groupId;

            if (depth > maxDepth) {
                throw new ModuleDepthError(depth);
            }

            if (child.id) {
                // Update existing
                await prisma.menuItem.update({
                    where: { id: +child.id },
                    data: {
                        name: child.name,
                        path: childUrl,
                        groupId: Number(groupId),
                        parentId,
                        isActive: true
                    },
                });

                if (child.children && child.children.length > 0) {
                    await syncChildren(child.children, +child.id, depth + 1);
                } else {
                    // Remove nested children from DB if none provided
                    await prisma.menuItem.deleteMany({ where: { parentId: +child.id } });
                }
            } else {
                // Create new
                const created = await prisma.menuItem.create({
                    data: {
                        name: child.name,
                        path: childUrl,
                        groupId: Number(groupId),
                        parentId,
                    },
                });

                if (child.children && child.children.length > 0) {
                    await syncChildren(child.children, +created.id, depth + 1);
                }
            }
        })
    );
}

// Delete removed children and all its nested children
async function deleteModuleAndDescendants(menuId: number) {

    const assigned = await prisma.rolePermission.findMany({
        where: { menuId: +menuId },
        select: {
            menuId: true,
            menus: { select: { name: true } },
            role: { select: { name: true } },
        },
    });

    if (assigned.length > 0) {
        const grouped = assigned.reduce<Record<string, string[]>>((acc, curr) => {
            const moduleName = curr.menus.name || 'Unknown';
            const roleName = curr.role.name || 'Unknown';
            if (!acc[moduleName]) acc[moduleName] = [];
            acc[moduleName].push(roleName);
            return acc;
        }, {});

        throw {
            code: 'ASSIGNED_MODULE',
            message: 'Cannot delete assigned module.',
            assigned: grouped,
        };
    }

    // Delete children recursively
    const childModules = await prisma.menuItem.findMany({
        where: { parentId: +menuId },
        select: { id: true },
    });

    await Promise.all(childModules.map((c) => deleteModuleAndDescendants(+c.id)));

    // Delete this module
    await prisma.menuItem.delete({ where: { id: +menuId } });
}

class ModuleDepthError extends Error {
    constructor(depth: number) {
        super(`Modules deeper than 3 levels (${depth}) are not allowed.`);
        this.name = "ModuleDepthError";
    }
}