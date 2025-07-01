import { GroupedMenus, MenuItem } from "../menus";

/**
 * Matches a target path against a menu item's path pattern,
 * handling dynamic segments like [param] and [...catchAll]
 */
function matchMenuItemPath(target: string, itemPath?: string): boolean {
    if (!itemPath) return false;
    if (target === itemPath) return true;

    // Convert Next.js dynamic route patterns to regex patterns
    const dynamicPattern = itemPath
        .replace(/\[\.\.\.(\w+)\]/g, '.*')       // Catch-all segments [...slug]
        .replace(/\[\[\.\.\.(\w+)\]\]/g, '.*')  // Optional catch-all [[...slug]]
        .replace(/\[(\w+)\]/g, '[^/]+')          // Dynamic segments [slug]
        .replace(/\//g, '\\/');                  // Escape forward slashes

    // Match exact path or nested paths under this route
    const exactRegex = new RegExp(`^${dynamicPattern}$`);
    const nestedRegex = new RegExp(`^${dynamicPattern}(/.*)?$`);

    return exactRegex.test(target) || nestedRegex.test(target);
}

/**
 * Finds a menu item that matches the given criteria
 */
export function findMatchingMenuItem(
    groups: GroupedMenus[],
    { id, path, name }: { id?: number; path?: string; name?: string }
): MenuItem | undefined {
    // Flatten all menu items from all groups
    const allItems: MenuItem[] = [];
    groups.forEach(group => {
        allItems.push(...group?.modules);
        // Also include nested children
        group.modules.forEach(item => {
            if (item.children?.length) {
                allItems.push(...item.children);
            }
        });
    });

    if (id !== undefined) {
        return allItems.find(item => item.id === id);
    }

    if (path) {
        return allItems.find(item => matchMenuItemPath(path, item.path));
    }

    if (name) {
        return allItems.find(item => item.name === name);
    }

    return undefined;
}

/**
 * Finds a menu group that contains the matching item
 */
export function findMatchingMenuGroup(
    groups: GroupedMenus[],
    criteria: { id?: number; path?: string; name?: string }
): GroupedMenus | undefined {
    return groups.find(group => {
        // Check if the group itself matches
        if (criteria.id !== undefined && group.groupId === criteria.id) return true;
        if (criteria.name && group.groupName === criteria.name) return true;

        // Check if any item in the group matches
        return group.modules.some(item => {
            if (criteria.id !== undefined && item.id === criteria.id) return true;
            if (criteria.path && matchMenuItemPath(criteria.path, item.path)) return true;
            if (criteria.name && item.name === criteria.name) return true;

            // Check children recursively
            return item.children?.some(child => {
                if (criteria.id !== undefined && child.id === criteria.id) return true;
                if (criteria.path && matchMenuItemPath(criteria.path, child.path)) return true;
                return criteria.name && child.name === criteria.name;
            });
        });
    });
}