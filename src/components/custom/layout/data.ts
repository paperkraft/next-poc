import {
    BookOpen,
    GraduationCapIcon,
    Home,
    ImageIcon,
    Settings2,
} from "lucide-react"

type submenuType = {
    title: string;
    url: string;
    submenu?: submenuType[];
}

export type menuType = {
    label: string;
    title: string;
    url: string;
    icon: any;
    isActive: boolean;
    submenu: submenuType[];
}

export const data:menuType[] = [
    {
        label: "Home",
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        submenu: [],
    },
    {
        label: "Home",
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
                        url: "#",
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
export const menus = uniqueLabels.map((label) => data.filter((menu) => menu.label === label).map((item) => item));