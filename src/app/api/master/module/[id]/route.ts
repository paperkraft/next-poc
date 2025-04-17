import { logAuditAction } from '@/lib/audit-log';
import prisma from '@/lib/prisma';
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

        // Step 2: Fetch existing children from DB
        // const existingChildren = await prisma.module.findMany({
        //     where: { parentId: params.id },
        //     select: { id: true },
        // });

        // const existingIds = existingChildren.map((child) => child.id);
        // const submittedIds = children.map((child: any) => child.id).filter(Boolean);

        // // Step 3: Delete removed children (present in DB but missing from payload)
        // const childrenToDelete = existingIds.filter((id) => !submittedIds.includes(id));

        // await prisma.module.deleteMany({
        //     where: {
        //         id: { in: childrenToDelete },
        //     },
        // });

        // // Step 4: Update existing children and create new ones
        // const childOps = children.map((child: any) => {
        //     if (child.id) {
        //         // Update existing
        //         return prisma.module.update({
        //             where: { id: child.id },
        //             data: {
        //                 name: child.name,
        //                 path: child.path,
        //                 parentId: updatedModule.id,
        //             },
        //         });
        //     } else {
        //         // Create new
        //         return prisma.module.create({
        //             data: {
        //                 name: child.name,
        //                 path: child.path,
        //                 parentId: updatedModule.id,
        //             },
        //         });
        //     }
        // });

        // await Promise.all(childOps);

        // Step 2: Recursive handler to sync children
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


            // Step 4: Update/create children and recurse
            // for (const child of children) {
            //     const childUrl = child.path?.startsWith('/') ? child.path : `/${child.path}`;
            //     const groupId = child.groupId ? child.groupId : undefined;

            //     if (child.id) {
            //         await prisma.module.update({
            //             where: { id: child.id },
            //             data: {
            //                 name: child.name,
            //                 path: childUrl,
            //                 groupId: groupId,
            //                 parentId,
            //             },
            //         });

            //         if (child.children && child.children.length > 0) {
            //             await syncChildren(child.children, child.id);
            //         } else {
            //             // If no children in payload, delete any in DB
            //             await prisma.module.deleteMany({
            //                 where: { parentId: child.id },
            //             });
            //         }
            //     } else {
            //         const created = await prisma.module.create({
            //             data: {
            //                 name: child.name,
            //                 path: childUrl,
            //                 groupId: groupId,
            //                 parentId,
            //             },
            //         });

            //         if (child.children && child.children.length > 0) {
            //             await syncChildren(child.children, created.id);
            //         }
            //     }
            // }
        }

        await syncChildren(children, params.id);

        return NextResponse.json({ success: true, message: 'Module and children updated successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to update module' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const rolePermissionCount = await prisma.rolePermission.count({
            where: { moduleId: params.id },
        });

        if (rolePermissionCount > 0) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete: module is assigned to one or more roles.' },
                { status: 400 }
            );
        }

        const moduleCount = await prisma.module.count({
            where: { parentId: params.id },
        });

        if (moduleCount > 0) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete: module has child modules.' },
                { status: 400 }
            );
        }

        const module = await prisma.module.findUnique({
            where: { id: params.id },
        })

        if (!module) {
            return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
        }

        if (module.isDeleted) {
            return NextResponse.json({ success: false, message: 'Module already deleted' }, { status: 400 });
        }

        await prisma.module.update({
            where: { id: params.id },
            data: { isDeleted: true },
        });

        await logAuditAction('Delete', 'master/module', { data: params.id });
        return NextResponse.json({ success: true, message: 'Module deleted' });
    } catch (error) {
        await logAuditAction('Error', 'master/module', { error: 'Failed to delete module' });
        return NextResponse.json({ success: false, message: 'Failed to delete module' }, { status: 500 });
    }
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