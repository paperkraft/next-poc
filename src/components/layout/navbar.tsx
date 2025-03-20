"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, DotIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mapMenu, transformMenuData } from "./Sidebar/helper";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
interface MenuItem {
    title: string;
    url?: string;
    icon?: React.ComponentType;
    submenu?: MenuItem[];
}

const DropdownMenu = ({ items }: { items: MenuItem[] }) => {
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
        }, 1);
    };

    const handleMouseEnter = (path: string) => openMenu(path);
    const handleMouseLeave = (path: string) => closeMenu(path);

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
                    className="relative text-sm"
                    onMouseEnter={() => handleMouseEnter(currentPath)}
                    onMouseLeave={() => handleMouseLeave(currentPath)}
                >
                    <button
                        onClick={() => handleClick(currentPath)}
                        className={cn("w-full flex justify-between items-center gap-1 p-2 hover:bg-muted rounded hover:text-primary", level == 0 && "py-3")}
                    >
                        {item.url ? (
                            <Link href={item.url} className="flex gap-2 [&>svg]:size-4 items-center w-full">
                                {item.icon ? <item.icon /> : level !== 0 && <DotIcon/>}
                                <span>{item.title}</span>
                            </Link>
                        ) : (
                            <div className="flex gap-2 [&>svg]:size-5 w-full">
                                {item.icon ? <item.icon /> : level !== 0 &&  <DotIcon/>}
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
                                    className={`absolute min-w-56 bg-background shadow-lg border rounded-lg p-1 ${level > 0 ? "left-full top-0 ml-2" : "mt-2 left-0"}`}
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

    return <nav className="flex space-x-6">{renderMenuItems(items)}</nav>;
};

function Navbar() {

    const { data, status } = useSession();
    const formattedMenus = React.useMemo(() => data?.user?.modules ? mapMenu(data.user.modules) : [], [data?.user?.modules]);
    const groupedMenus = React.useMemo(() => Object.values(_.groupBy(formattedMenus, "label")), [formattedMenus]);
    const menuItems = transformMenuData(groupedMenus);

    return (
        <div className="container mx-auto flex items-center">
            <DropdownMenu items={menuItems} />
        </div>
    );
}

export default React.memo(Navbar);