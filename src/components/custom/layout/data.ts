import {
    Book,
    GraduationCapIcon,
    Home,
    ImageIcon,
    Settings2,
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
        label: "Master",
        title: "Student",
        url: "/student",
        icon: GraduationCapIcon,
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
                    {
                        title: "Tutorials",
                        url: "#",
                    }
                ],
            },
            {
                title: "Access",
                url: "/access-control",
            }
        ],
    }
]

export const uniqueLabels = Array.from(new Set(data.map((menu) => menu.label)));
export const menus: menuType[][] = uniqueLabels.map((label) => data.filter((menu) => menu.label === label).map((item) => item));