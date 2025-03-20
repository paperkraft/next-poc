import { IconData } from "../icon-data";

type inputType = {
    id: string;
    name: string;
    parentId: string | null;
    permissions: number;
    group: string;
    path: string;
    subModules: inputType[];
};

interface MenuItem {
    title: string;
    url?: string;
    icon?: React.ComponentType;
    submenu?: MenuItem[];
}

export type submenuType = {
    title: string;
    url: string;
    submenu?: submenuType[];
}

export type menuType = {
    label: string;
    title: string;
    url: string;
    icon: React.ComponentType;
    isActive: boolean;
    submenu: submenuType[];
}

const generateSubMenu = (subModule: inputType): submenuType => ({
    title: subModule.name,
    url: subModule.path ?? '#',
    submenu: subModule.subModules.map(generateSubMenu)
});

export const mapMenu = (inputData: inputType[]): menuType[] => {
    const groupedData = inputData && inputData?.reduce((acc, item) => {
        if (!acc[item.group]) {
            acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
    }, {} as { [key: string]: inputType[] });

    return Object.keys(groupedData).map((groupLabel) => {
        const groupItems = groupedData[groupLabel];

        return groupItems.map((item) => {

            // Find the icon from IconData based on the title
            const matchingIcon = IconData.find(icon => icon.title === item.name)?.icon;

            return {
                label: item.group,
                title: item.name,
                url: item.path ?? '#',
                icon: matchingIcon as React.ComponentType,
                isActive: false,
                submenu: item.subModules.map(generateSubMenu),
            }
        });
    }).flat();
};

export function getBreadcrumbs(menus: menuType[], url: string): { label: string; title: string; url: string }[] | null {
    const findBreadcrumbs = (submenus: submenuType[], url: string, breadcrumb: { label: string; title: string; url: string }[] = []): { label: string; title: string; url: string }[] | null => {
        for (const submenu of submenus) {
            if (submenu.url === url) {
                return [...breadcrumb, { label: breadcrumb[0]?.label ?? '', title: submenu.title, url: submenu.url }];
            }

            if (submenu.submenu) {
                const result = findBreadcrumbs(submenu.submenu, url, [...breadcrumb, { label: breadcrumb[0]?.label ?? '', title: submenu.title, url: submenu.url }]);
                if (result) return result;
            }
        }
        return null;
    };

    for (const menu of menus) {
        if (menu.url === url) {
            return [{ label: menu.label, title: menu.title, url: menu.url }];
        }

        const breadcrumbResult = findBreadcrumbs(menu.submenu, url, [{ label: menu.label, title: menu.title, url: menu.url }]);
        if (breadcrumbResult) {
            return breadcrumbResult;
        }
    }

    return null;
}


export function checkIsActive(item: menuType, pathname: string): boolean {
    const isSubmenuActive = (submenu: submenuType[]): boolean => {
        return submenu.some(sub =>
            sub.url === pathname ||
            pathname.startsWith(sub.url) ||
            (sub.submenu ? isSubmenuActive(sub.submenu) : false)
        );
    };

    return (
        item.url === pathname ||
        pathname.startsWith(item.url) ||
        isSubmenuActive(item.submenu)
    );
}

export function findTopParent(menu: menuType[][], path: string): menuType | null {
    for (const section of menu) {
        for (const item of section) {
            const result = searchSubmenuRecursive(item.submenu, item, path);
            if (result) return result;
        }
    }
    return null;
}

export function searchSubmenuRecursive(items: submenuType[], parent: menuType | null, path: string): menuType | null {
    for (const item of items) {
        if (item.url === path) return parent ?? (item as menuType);
        if (item.submenu?.length) {
            const found = searchSubmenuRecursive(item.submenu, parent ?? (item as menuType), path);
            if (found) return found;
        }
    }
    return null;
}

export function searchSubmenu(submenu: submenuType[], query: string): boolean {
    return submenu.some(
        item =>
            item.title.toLowerCase().includes(query) ||
            (item.submenu && searchSubmenu(item.submenu, query))
    );
}



export const cleanSubMenu = (submenu: submenuType[]): MenuItem[] => {
    return submenu.map((item) => {
        const cleanedItem: MenuItem = {
            title: item.title,
            url: item.url !== "#" ? item.url : undefined,
        };

        if (item.submenu && item.submenu.length) {
            cleanedItem.submenu = cleanSubMenu(item.submenu);
        }

        return cleanedItem;
    });
};

export const transformMenuData = (data: menuType[][]): MenuItem[] => {
    const grouped: Record<string, MenuItem> = {};

    data.flat().forEach((item) => {
        const groupLabel = item.label;

        if (!grouped[groupLabel]) {
            grouped[groupLabel] = {
                title: groupLabel,
                submenu: [],
            };
        }

        const subMenuItem: MenuItem = {
            title: item.title,
            icon: item.icon,
            url: item.url !== "#" ? item.url : undefined,
            submenu: item.submenu && item.submenu.length ? cleanSubMenu(item.submenu) : undefined,
        };

        grouped[groupLabel].submenu?.push(subMenuItem);
    });

    return Object.values(grouped);
}
