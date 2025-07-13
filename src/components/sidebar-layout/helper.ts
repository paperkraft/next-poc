import { GroupedMenus, MenuItem } from "@/lib/menus";

export function findTopParent(menu: GroupedMenus[], path: string): MenuItem | null {
    for (const section of menu) {
        for (const item of section.modules) {
            const result = searchSubmenuRecursive(item.children, item, path);
            if (result) return result;
        }
    }
    return null;
}

function searchSubmenuRecursive(items: MenuItem[], parent: MenuItem | null, path: string): MenuItem | null {
    for (const item of items) {
        if (item.path === path) return parent ?? (item as MenuItem);
        if (item.children?.length) {
            const found = searchSubmenuRecursive(item.children, parent ?? (item as MenuItem), path);
            if (found) return found;
        }
    }
    return null;
}


export function checkIsActive(item: MenuItem, pathname: string): boolean {
    const isChildActive = (children: MenuItem[]): boolean => {
        return children.some(child =>
            child?.path === pathname ||
            child?.path && pathname.startsWith(child?.path) ||
            (child?.children ? isChildActive(child.children) : false)
        );
    };

    return (
        item?.path === pathname ||
        item?.path && pathname.startsWith(item.path) ||
        isChildActive(item.children)
    );
}
