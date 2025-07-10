import prisma from "./prisma";

export async function getTenantMenu(tenantSlug: string) {
    const items = await prisma.menuItem.findMany({
        where: { tenant: { slug: tenantSlug } },
        orderBy: { group: { position: 'asc' } }
    });

    return items.map(item => ({
        ...item,
        href: `/${tenantSlug}/${item.path}` // Convert to full path
    }));
}

export async function getTenantBySlug(tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug }
    });
    return tenant
}

export async function getRoleId(tenantId: number) {
    const adminRole = await prisma.role.findFirst({
        where: {
            tenantId: +tenantId,
            name: {
                contains: 'admin',  // Match roles whose name contains 'admin'
                mode: 'insensitive',  // Case-insensitive match (optional, can be removed if not needed)
            },
        }
    })

    if (!adminRole) {
        throw new Error('Admin role not found for this tenant');
    }

    // Return the roleId of the found admin role
    return adminRole.id;
}

export async function getRoleIdWithEmail(email: string) {
    const adminRole = await prisma.user.findFirst({
        where: { email },
        select: {
            roleId: true
        }
    })

    if (!adminRole) {
        throw new Error('Admin role not found for this tenant');
    }

    // Return the roleId of the found admin role
    return adminRole.roleId;
}

export type MenuItem = {
    id: number;
    name: string;
    path?: string;
    icon: string;
    parentId?: number;
    groupId?: number;
    groupName?: string;
    position?: number;
    permission?: number;
    children: MenuItem[];
};

export type GroupedMenus = {
    groupId: number;
    groupName: string;
    position: number;
    modules: MenuItem[];
}

export async function getUserModules(tenantId: number | null, roleId: number): Promise<GroupedMenus[]> {
    // Fetch all menu items with permissions in a single optimized query
    const rolePermissions = await prisma.rolePermission.findMany({
        where: {
            tenantId,
            roleId,
            permissionBits: { not: 0 }, // Only items with permissions
            menus: {
                isActive: true, // Only active menus
                group: {
                    isActive: true, // Only active groups
                }
            }
        },
        select: {
            permissionBits: true,
            tenant: {
                select: {
                    slug: true
                }
            },
            menus: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    path: true,
                    parentId: true,
                    groupId: true,
                    group: {
                        select: {
                            id: true,
                            name: true,
                            position: true,
                        }
                    },
                    children: {
                        select: {
                            id: true,
                            name: true,
                            icon: true,
                            path: true,
                            parentId: true,
                            groupId: true,
                            children: {
                                select: {
                                    id: true,
                                    icon: true,
                                    name: true,
                                    path: true,
                                    parentId: true,
                                    groupId: true,
                                },
                                where: { isActive: true }, // Add filter for active children
                                orderBy: { id: 'asc' }
                            },
                        },
                        where: { isActive: true }, // Add filter for active children
                        orderBy: { id: 'asc' }
                    },
                },
            },

        },
        orderBy: {
            menus: {
                group: {
                    position: 'asc',
                },
            },
        },
    });

    //------------------------------ Map Permission Bits -------------------------------

    const permissionMap = new Map<number, number>();

    rolePermissions.forEach((rp) => {
        permissionMap.set(rp.menus.id, rp.permissionBits);
    });

    //------------------------------ Create Menu Map -------------------------------

    const menuMap = new Map<number, MenuItem>();

    for (const rp of rolePermissions) {
        const menu = rp.menus;
        const group = menu.group;
        const slug = rp.tenant?.slug;

        // Only add the menu if it has valid permissionBits (permission != 0)
        if (!menuMap.has(menu.id)) {
            menuMap.set(menu.id, {
                id: menu.id,
                name: menu.name,
                icon: menu.icon ?? "DotIcon",
                path: slug ? `/${slug}${menu.path}` : `/admin${menu.path}` || undefined,
                parentId: menu.parentId || undefined,
                groupId: group?.id,
                groupName: group?.name,
                position: group?.position,
                permission: permissionMap.get(menu.id) || 0, // Only set permission for the current item
                children: [],
            });
        }

        // Process children (second level)
        for (const child of menu.children) {
            if (!menuMap.has(child.id)) {
                menuMap.set(child.id, {
                    id: child.id,
                    name: child.name,
                    icon: child.icon ?? "DotIcon",
                    path: slug ? `/${slug}${child.path}` : `/admin${child.path}` || undefined,
                    parentId: child.parentId || undefined,
                    groupId: group?.id,
                    groupName: group?.name,
                    position: group?.position,
                    permission: permissionMap.get(child.id), // Only set permission for the child if it's valid
                    children: [],
                });
            }

            // Process grandchildren (third level)
            for (const grandchild of child.children) {
                if (!menuMap.has(grandchild.id)) {
                    menuMap.set(grandchild.id, {
                        id: grandchild.id,
                        name: grandchild.name,
                        icon: grandchild.icon ?? "DotIcon",
                        path: slug ? `/${slug}${grandchild.path}` : `/admin${grandchild.path}` || undefined,
                        parentId: grandchild.parentId || undefined,
                        groupId: group?.id,
                        groupName: group?.name,
                        position: group?.position,
                        permission: permissionMap.get(grandchild.id), // Only set permission for the grandchild if it's valid
                        children: [],
                    });
                }
            }
        }
    }

    //------------------------------ Build Hierarchy -------------------------------

    const groupsMap = new Map<number, MenuItem[]>();

    for (const [menuId, menu] of menuMap) {
        // If it's a top-level menu (no parent)
        if (!menu.parentId) {
            if (!menu.groupId) continue; // Skip if no group

            if (!groupsMap.has(menu.groupId)) {
                groupsMap.set(menu.groupId, []);
            }
            groupsMap.get(menu.groupId)!.push(menu);
            continue;
        }

        // Find the parent in our map and add as child only if valid permissions exist
        const parent = menuMap.get(menu.parentId);
        if (parent && parent.permission && menu.permission) {
            // Only add the menu to its parent's children if both parent and child have valid permissions
            parent.children.push(menu);
        }

        // Filter children with invalid permissions (permission = 0)
        menu.children = menu.children.filter(child => child.permission !== 0);
    }

    //------------------------------ Organize and Sort -------------------------------

    return Array.from(groupsMap.entries())
        .map(([groupId, modules]) => {
            // Find the group info from any menu in this group
            const groupInfo = modules[0]?.groupId === groupId ? {
                groupName: modules[0]?.groupName,
                position: modules[0]?.position,
            } : { groupName: undefined, position: undefined };

            return {
                groupId,
                groupName: groupInfo.groupName || '',
                position: groupInfo.position || 0,
                modules: modules.sort((a, b) => (a.id - b.id)),
            };
        })
        .sort((a, b) => a.position - b.position);
}