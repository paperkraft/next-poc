"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

const menuItems = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Services",
        subMenu: [
            { label: "Web Development", href: "/services/web-development" },
            
            {
                label: "More",
                subMenu: [
                    { label: "SEO", href: "/services/seo" },
                    {
                        label: "Marketing",
                        subMenu: [
                            { label: "Sample One", href: "/services/marketing/1" },
                            { label: "Sample Two", href: "/services/marketing/2" },
                        ],
                    },
                    {
                        label: "More",
                        subMenu: [
                            { label: "SEO", href: "/services/seo" },
                            {
                                label: "Marketing",
                                subMenu: [
                                    { label: "Sample One", href: "/services/marketing/1" },
                                    { label: "Sample Two", href: "/services/marketing/2" },
                                ],
                            },
                        ],
                    },
                ],
            },
            { label: "Mobile Development", href: "/services/mobile-development" },
        ],
    },
    {
        label: "About Us",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];

interface MenuItem {
    label: string;
    href?: string;
    subMenu?: MenuItem[];
}

const DropdownMenu = ({ items }: { items: typeof menuItems }) => {
    const [openPaths, setOpenPaths] = useState<string[]>([]);
    const timeouts = useRef<Record<string, NodeJS.Timeout | null>>({});

    const openMenu = (path: string) => {
        if (timeouts.current[path]) {
            clearTimeout(timeouts.current[path]!);
            timeouts.current[path] = null;
        }
        setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]));
    };

    const closeMenu = (path: string) => {
        timeouts.current[path] = setTimeout(() => {
            setOpenPaths((prev) => prev.filter((p) => !p.startsWith(path)));
        }, 200);
    };

    const handleMouseEnter = (path: string) => {
        openMenu(path);
    };

    const handleMouseLeave = (path: string) => {
        closeMenu(path);
    };

    const handleClick = (path: string) => {
        if (openPaths.includes(path)) {
            setOpenPaths((prev) => prev.filter((p) => !p.startsWith(path)));
        } else {
            openMenu(path);
        }
    };

    const isPathOpen = (currentPath: string) => openPaths.includes(currentPath);

    const renderMenuItems = (menuItems: MenuItem[], path = "", level: number = 0) => {
        return menuItems.map((item, index) => {
            const currentPath = `${path}-${index}`;
            const isOpen = isPathOpen(currentPath);

            return (
                <div
                    key={currentPath}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(currentPath)}
                    onMouseLeave={() => handleMouseLeave(currentPath)}
                >
                    <button
                        onClick={() => handleClick(currentPath)}
                        className="w-full flex justify-between items-center gap-1 p-2 hover:bg-primary-foreground rounded"
                    >
                        {item.href ? (
                            <Link href={item.href}>{item.label}</Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                        {item.subMenu && (level === 0 ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {item.subMenu && isOpen && (
                        <div
                            className={`absolute mt-2 w-48 bg-background shadow-lg border rounded-lg p-2 ${level > 0 ? "left-full top-0 ml-3" : "left-0"}`}
                        >
                            {renderMenuItems(item.subMenu, currentPath, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return <nav className="flex space-x-8">{renderMenuItems(items)}</nav>;
};



export default function Navbar() {
    return (
        <div className="container mx-auto flex items-center">
            <DropdownMenu items={menuItems} />
        </div>
    );
}
