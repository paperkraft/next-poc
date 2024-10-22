import {
    BookOpen,
    GraduationCapIcon,
    Home,
    ImageIcon,
    Settings2,
} from "lucide-react"

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
        label: "Home",
        title: "Gallery",
        url: "/gallery",
        icon: ImageIcon,
        isActive: false,
        submenu: [],
    },
    {
        label: "Home",
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
            },
            {
                title: "Access",
                url: "/access-control",
            }
        ],
    },
    {
        label: "Master",
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        isActive: false,
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
    }
]

export const uniqueLabels = Array.from(new Set(data.map((menu) => menu.label)));
export const menus = uniqueLabels.map((label) => data.filter((menu) => menu.label === label).map((item) => item));