import {
    Book,
    GraduationCapIcon,
    Home,
    ImageIcon,
    LayoutGrid,
    Settings2,
    User2,
} from "lucide-react"

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

const dashboard = [
    {
        label: "Home",
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        submenu: [],
    },
]

export const data = [
    {
        label: "Home",
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        submenu: [],
    },
    {
        label: "Picture",
        title: "Gallery",
        url: "/gallery",
        icon: ImageIcon,
        isActive: false,
        submenu: [],
    },
    {
        label: "Master",
        title: "Student",
        url: "/student",
        icon: GraduationCapIcon,
        isActive: false,
        submenu: [],
    },
    {
        label: "Master",
        title: "Role",
        url: "/master/role",
        icon: User2,
        isActive: false,
        submenu: [],
    },
    {
        label: "Master",
        title: "Module",
        url: "/master/module",
        icon: LayoutGrid,
        isActive: false,
        submenu: [],
    },
    {
        label: "Master",
        title: "Academics",
        url: "#",
        icon: Book,
        isActive: false,
        submenu: [
            {
                title: "Student",
                url: "#",
                submenu: [
                    {
                        title: "Division",
                        url: "#",
                        submenu: [
                            {
                                title: "Assign",
                                url: "#",
                            },
                            {
                                title: "Transfer",
                                url: "#",
                            },
                        ],
                    },
                    {
                        title: "Attendance",
                        url: "#",
                    },
                ],
            },
        ],
    },
    {
        label: "Home",
        title: "Settings",
        url: "#",
        icon: Settings2,
        isActive: false,
        submenu: [
            {
                title: "General",
                url: "/general",
                submenu: [
                    {
                        title: "Introduction",
                        url: "/settings/general/introduction",
                    },
                    {
                        title: "Get Started",
                        url: "#",
                    },
                ]
            },
            {
                title: "Access",
                url: "/settings/rbac",
            }
        ]
    }
]

export const uniqueLabels = Array.from(new Set(data.map((menu) => menu.label)));
export const menus: menuType[][] = uniqueLabels.map((label) => data.filter((menu) => menu.label === label));
export const defalutMenu: menuType[][] = uniqueLabels.map((label) => dashboard.filter((menu) => menu.label === label));

// Permissions bitmask checking function
const hasPermission = (userPermissions: number, requiredPermissions: number) => {
    return (userPermissions & requiredPermissions) === requiredPermissions;
};

// Recursive function to transform submodules and assign URLs
const transformSubmodules = (submodules: any[], userPermissions: number): any => {
    return submodules
        .filter((submodule) => hasPermission(userPermissions, submodule.permissions))
        .map((submodule) => {
            // Find the matching submenu from the original data
            const matchedSubmenu = findMenuByTitle(data, submodule.name);
            const submenuUrl = matchedSubmenu ? matchedSubmenu.url : "#";

            // Recursively handle submodules within submodules
            const transformedSubmodules = submodule.submodules
                ? transformSubmodules(submodule.submodules, userPermissions)
                : [];

            return {
                title: submodule.name,
                url: submenuUrl,
                submenu: transformedSubmodules,
            };
        });
};

// Recursive function to search for a submenu by its title in the entire menu data (including nested submenus)
const findMenuByTitle = (menuData: menuType[], title: string): menuType | null => {
    for (let item of menuData) {
        if (item.title === title) {
            return item;
        }
        if (item.submenu && item.submenu.length > 0) {
            const found = findMenuByTitle(item.submenu as any, title);
            if (found) return found;
        }
    }
    return null;
};

// Function to recursively transform server data
export const transformMenuData = (serverData: any[], userPermissions: number): menuType[] => {
    return serverData
        .map((menuItem) => {
            // Find the matching menu item from the original data
            const matchedMenu = data.find((item) => item.title === menuItem.name);

            if (matchedMenu && hasPermission(userPermissions, menuItem.permissions)) {
                // Transform the submodules using the recursive function
                const submenus = transformSubmodules(menuItem.submodules, userPermissions);

                return {
                    ...matchedMenu,
                    submenu: submenus.length > 0 ? submenus : [],
                    isActive: false,
                };
            }
            return null;
        })
        .filter((item) => item !== null);
};