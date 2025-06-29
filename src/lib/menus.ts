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

export type MenuItem = {
    id: number;
    name: string;
    path?: string;
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

export async function getUserModules(tenantId: number, roleId: number): Promise<GroupedMenus[]> {
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
            menus: {
                select: {
                    id: true,
                    name: true,
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
                            path: true,
                            parentId: true,
                            groupId: true,
                            children: {
                                select: {
                                    id: true,
                                    name: true,
                                    path: true,
                                    parentId: true,
                                    groupId: true,
                                },
                                orderBy: { id: 'asc' }
                            },
                        },
                        orderBy: { id: 'asc' }
                    },
                },
            },
            tenant: {
                select: {
                    slug: true
                }
            }
        },
        orderBy: {
            menus: {
                group: {
                    position: 'asc',
                },
            },
        },
    });

    // Create a map for all menu items with their permissions
    const menuMap = new Map<number, MenuItem>();

    // First pass: process all menu items and store in map
    for (const rp of rolePermissions) {
        const menu = rp.menus;
        const group = menu.group;
        const slug = rp.tenant?.slug;

        // Create or update menu item in map
        if (!menuMap.has(menu.id)) {
            menuMap.set(menu.id, {
                id: menu.id,
                name: menu.name,
                path: slug ? `/${slug}${menu.path}` : `/admin${menu.path}` || undefined,
                parentId: menu.parentId || undefined,
                groupId: group?.id,
                groupName: group?.name,
                position: group?.position,
                permission: rp.permissionBits,
                children: [],
            });
        } else {
            // Combine permissions if menu appears multiple times
            const existing = menuMap.get(menu.id)!;
            existing.permission = (existing.permission || 0) | rp.permissionBits;
        }

        // Process children (second level)
        for (const child of menu.children) {
            if (!menuMap.has(child.id)) {
                menuMap.set(child.id, {
                    id: child.id,
                    name: child.name,
                    path: child.path || undefined,
                    parentId: child.parentId || undefined,
                    groupId: group?.id,
                    groupName: group?.name,
                    position: group?.position,
                    permission: rp.permissionBits,
                    children: [],
                });
            }

            // Process grandchildren (third level)
            for (const grandchild of child.children) {
                if (!menuMap.has(grandchild.id)) {
                    menuMap.set(grandchild.id, {
                        id: grandchild.id,
                        name: grandchild.name,
                        path: grandchild.path || undefined,
                        parentId: grandchild.parentId || undefined,
                        groupId: group?.id,
                        groupName: group?.name,
                        position: group?.position,
                        permission: rp.permissionBits,
                        children: [],
                    });
                }
            }
        }
    }

    // Second pass: build the hierarchy
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

        // Find the parent in our map and add as child
        const parent = menuMap.get(menu.parentId);
        if (parent) {
            parent.children.push(menu);
        }
    }

    // Third pass: handle any remaining hierarchy (shouldn't be needed with the optimized query)
    for (const rp of rolePermissions) {
        const menu = rp.menus;
        if (!menu.parentId) continue;

        for (const child of menu.children) {
            const parentInMap = menuMap.get(child.id);
            if (parentInMap) {
                for (const grandchild of child.children) {
                    if (menuMap.has(grandchild.id)) {
                        const existing = parentInMap.children.find(c => c.id === grandchild.id);
                        if (!existing) {
                            parentInMap.children.push(menuMap.get(grandchild.id)!);
                        }
                    }
                }
            }
        }
    }

    // Organize by groups and sort
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