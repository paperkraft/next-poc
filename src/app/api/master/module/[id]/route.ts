import { logAuditAction } from '@/lib/audit-log';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
    params: { id: string };
}

type ModuleInput = {
    id?: string;
    name: string;
    path?: string;
    groupId?: string;
    children?: ModuleInput[];
};

const maxDepth = 2; // Maximum depth allowed for modules

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const module = await prisma.module.findUnique({
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

        const url = path && path.startsWith('/') ? path : path.startsWith('#') ? undefined : `/${path}`;

        // Step 1: Update parent module
        const updatedModule = await prisma.module.update({
            where: { id: params.id },
            data: { name, path: url, groupId: groupId ? groupId : undefined },
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
        return NextResponse.json({ success: false, message: 'Module ID is required' }, { status: 400 });
    }

    try {
        // Collect all IDs in the hierarchy
        await deleteModuleAndDescendants(id);

        return NextResponse.json({ success: true, message: "Module and children deleted" });
    } catch (err) {
        console.error('Delete module error:', err);
        return NextResponse.json({ success: false, message: 'Failed to delete module' }, { status: 500 });
    }
}


async function syncChildren(children: ModuleInput[], parentId: string, depth: number = 1) {

    if (depth > maxDepth) {
        throw new ModuleDepthError(depth);
    }

    const existingChildren = await prisma.module.findMany({
        where: { parentId },
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
            const childUrl = child.path && child.path?.startsWith('/') ? child.path : child.path?.startsWith('#') ? undefined : `/${child.path}`;
            const groupId = child.groupId || undefined;

            if (depth > maxDepth) {
                throw new ModuleDepthError(depth);
            }

            if (child.id) {
                // Update existing
                await prisma.module.update({
                    where: { id: child.id },
                    data: {
                        name: child.name,
                        path: childUrl,
                        groupId,
                        parentId,
                    },
                });

                if (child.children && child.children.length > 0) {
                    await syncChildren(child.children, child.id, depth + 1);
                } else {
                    // Remove nested children from DB if none provided
                    await prisma.module.deleteMany({ where: { parentId: child.id } });
                }
            } else {
                // Create new
                const created = await prisma.module.create({
                    data: {
                        name: child.name,
                        path: childUrl,
                        groupId,
                        parentId,
                    },
                });

                if (child.children && child.children.length > 0) {
                    await syncChildren(child.children, created.id, depth + 1);
                }
            }
        })
    );
}

// Delete removed children and all its nested children
async function deleteModuleAndDescendants(moduleId: string) {
    const childModules = await prisma.module.findMany({
        where: { parentId: moduleId },
        select: { id: true },
    });

    await Promise.all(childModules.map((c) => deleteModuleAndDescendants(c.id)));

    await prisma.module.delete({ where: { id: moduleId } });
}

class ModuleDepthError extends Error {
    constructor(depth: number) {
        super(`Modules deeper than 3 levels (${depth}) are not allowed.`);
        this.name = "ModuleDepthError";
    }
}