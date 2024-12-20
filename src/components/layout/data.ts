import {
    Book,
    Dot,
    GraduationCapIcon,
    Grid,
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
        label: "Module",
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
        title: "Groups",
        url: "/master/groups",
        icon: Grid,
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
        label: "Module",
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
            },
            {
                title: "Form Builder",
                url: "/settings/form-builder",
            }
        ]
    }
]

const uniqueLabels = Array.from(new Set(data.map((menu) => menu.label)));
export const menus: menuType[][] = uniqueLabels.map((label) => data.filter((menu) => menu.label === label));

// Permissions bitmask checking function
const hasPermission = (userPermissions: number, requiredPermissions: number) => {
    return (userPermissions & requiredPermissions) === requiredPermissions;
};

// Recursive function to transform submodules and assign URLs
const transformSubmodules = (subModules: any[], userPermissions: number): any => {
    return subModules
        .filter((subModule) => hasPermission(userPermissions, subModule.permissions))
        .map((subModule) => {
            // Find the matching submenu from the original data
            const matchedSubmenu = findMenuByTitle(data, subModule.name);
            const submenuUrl = matchedSubmenu ? matchedSubmenu.url : "#";

            // Recursively handle submodules within submodules
            const transformedSubmodules = subModule.subModules
                ? transformSubmodules(subModule.subModules, userPermissions)
                : [];

            return {
                title: subModule.name,
                url: submenuUrl,
                submenu: transformedSubmodules,
            };
        });
};

// Recursive function to search for a submenu by its title (including nested submenus)
const findMenuByTitle = (menuData: menuType[], title: string): menuType | null => {
    for (let item of menuData) {
        if (item.title.toLowerCase() === title.toLowerCase()) {
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
            const matchedMenu = data.find((item) => item.title.toLowerCase() === menuItem.name.toLowerCase());

            if (matchedMenu && hasPermission(userPermissions, menuItem.permissions)) {
                // Transform the submodules using the recursive function
                const submenus = transformSubmodules(menuItem.subModules, userPermissions);

                return {
                    ...matchedMenu,
                    submenu: submenus && submenus.length > 0 ? submenus : [],
                    isActive: false,
                };
            }

            // If no match is found in the hardcoded data, add the item dynamically
            if (hasPermission(userPermissions, menuItem.permissions)) {
                // Transform the submodules recursively, even if the parent is dynamically added
                const submenus = transformSubmodules(menuItem.subModules, userPermissions);

                return {
                    label: "Uncategorized",
                    title: menuItem.name,
                    url: "#",
                    icon: Dot,
                    isActive: false,
                    submenu: submenus && submenus.length > 0 ? submenus : []
                };
            }

            return null;
        })
        .filter((item) => item !== null);
};