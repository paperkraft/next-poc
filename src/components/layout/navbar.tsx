"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, DotIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mapMenu, transformMenuData } from "./Sidebar/helper";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { themeConfig } from "@/hooks/use-config";
import { usePathname } from "next/navigation";
interface MenuItem {
    title: string;
    url?: string;
    icon?: React.ComponentType;
    submenu?: MenuItem[];
}

const DropdownMenu = ({ items }: { items: MenuItem[] }) => {
    const [openPaths, setOpenPaths] = useState<string[]>([]);
    const timeouts = useRef<Record<string, NodeJS.Timeout | null>>({});
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const path = usePathname();

    const openMenu = (path: string) => {
        if (timeouts.current[path]) {
            clearTimeout(timeouts.current[path]!);
            timeouts.current[path] = null;
        }
        setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]));
    };

    const closeMenu = (path: string, level: number) => {
        if (level === 0) {
            timeouts.current[path] = setTimeout(() => {
                setOpenPaths((prev) => prev.filter((p) => !p.startsWith(path)));
            }, 100);
        } else {
            timeouts.current[path] = setTimeout(() => {
                setOpenPaths((prev) => prev.filter((p) => !p.startsWith(path)));
            }, 10);
        }
    };

    const handleMouseEnter = (path: string) => openMenu(path);
    const handleMouseLeave = (path: string, level: number) => closeMenu(path, level);

    const handleClick = (path: string) => {
        if (openPaths.includes(path)) {
            setOpenPaths((prev) => prev.filter((p) => !p.startsWith(path)));
        } else {
            openMenu(path);
        }
    };

    const isPathOpen = (currentPath: string) => openPaths.includes(currentPath);

    const getMenuPosition = (level: number, path: string) => {
        if (level === 0 || !itemRefs.current[path]) return "left-0 mt-2";

        const rect = itemRefs.current[path]!.getBoundingClientRect();
        const isOverflowing = rect.right + 240 > window.innerWidth;

        return isOverflowing ? "right-full -top-1 mr-2" : "left-full -top-1 ml-2";
    };

    const isActivePath = (url?: string) => {
        if (!url) return false;
        return path.includes(url) || path?.startsWith(url)
    };

    const renderMenuItems = (menuItems: MenuItem[], path = "", level: number = 0) => {
        return menuItems.map((item, index) => {
            const currentPath = `${path}-${index}`;
            const isOpen = isPathOpen(currentPath);

            const isActive = isActivePath(item.url) || (item.submenu && item.submenu.some((subItem) => isActivePath(subItem.url)));

            return (
                <div
                    key={currentPath}
                    className="relative text-sm"
                    onMouseEnter={() => handleMouseEnter(currentPath)}
                    onMouseLeave={() => handleMouseLeave(currentPath, level)}
                    ref={(el) => { itemRefs.current[currentPath] = el }}
                >
                    <button
                        onClick={() => handleClick(currentPath)}
                        className={cn("w-full flex justify-between items-center gap-1 p-2 hover:bg-muted rounded hover:text-primary",
                            level == 0 && "px-3",
                            isActive && "bg-muted text-primary",
                            item.url && "p-0"

                        )}
                    >
                        {item.url ? (
                            <Link href={item.url} className="flex gap-2 [&>svg]:size-4 items-center w-full p-2" onClick={() => setOpenPaths([])}>
                                {item.icon ? <item.icon /> : level !== 0 && <DotIcon />}
                                <span>{item.title}</span>
                            </Link>
                        ) : (
                            <div className="flex gap-2 [&>svg]:size-5 w-full">
                                {item.icon ? <item.icon /> : level !== 0 && <DotIcon />}
                                <span>{item.title}</span>
                            </div>
                        )}
                        {item.submenu && (level === 0 ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {item.submenu && (
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute min-w-56 bg-background shadow-lg border rounded-lg p-1 z-50 space-y-1  ${getMenuPosition(level, currentPath)}`}
                                >
                                    {renderMenuItems(item.submenu, currentPath, level + 1)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            );
        });
    };

    return <nav className="flex space-x-4">{renderMenuItems(items)}</nav>;
};

function Navbar() {

    const { data } = useSession();
    const [config] = themeConfig();
    const formattedMenus = React.useMemo(() => data?.user?.modules ? mapMenu(data.user.modules) : [], [data?.user?.modules]);
    const groupedMenus = React.useMemo(() => Object.values(_.groupBy(formattedMenus, "label")), [formattedMenus]);
    const menuItems = transformMenuData(groupedMenus);

    return (
        <div className={cn("flex items-center px-8", { "container mx-auto": config.content === 'compact' })}>
            <DropdownMenu items={menuItems} />
        </div>
    );
}

export default React.memo(Navbar);