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
    const isSubmenuActive = (submenu: MenuItem[]): boolean => {
        return submenu.some(sub =>
            sub?.path === pathname ||
            pathname.startsWith(sub?.path as string) ||
            (sub.children ? isSubmenuActive(sub.children) : false)
        );
    };

    return (
        item?.path === pathname ||
        pathname.startsWith(item?.path as string) ||
        isSubmenuActive(item.children)
    );
}