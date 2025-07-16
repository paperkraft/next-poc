import { GroupedMenus, MenuItem } from "@/lib/menus";

export type Breadcrumbs = {
    groupName: string;
    name: string;
    path: string;
};

/**
 * Finds breadcrumb trail for a specific path in the menu structure
 */
export function getBreadcrumbsFromGroupedMenus(
    groupedMenus: GroupedMenus[],
    targetPath: string
): Breadcrumbs[] {
    for (const group of groupedMenus) {
        const trail = findPathInModules(group.modules, targetPath, group.groupName);
        if (trail) return trail;
    }
    return [];
}

function findPathInModules(
    items: MenuItem[],
    targetPath: string,
    groupName: string,
    trail: Breadcrumbs[] = []
): Breadcrumbs[] | null {
    for (const item of items) {
        const current: Breadcrumbs = {
            groupName,
            name: item.name,
            path: item.path ?? "",
        };

        const newTrail = [...trail, current];

        if (item.path === targetPath) {
            return newTrail;
        }

        if (item.children && item.children.length > 0) {
            const result = findPathInModules(item.children, targetPath, groupName, newTrail);
            if (result) return result;
        }
    }

    return null;
}


export function truncate(text: string, maxLength: number = 20): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
