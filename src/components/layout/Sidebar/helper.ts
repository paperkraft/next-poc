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