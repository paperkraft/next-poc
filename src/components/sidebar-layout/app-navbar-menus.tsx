"use client";

import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useRef, useState } from 'react';

import { themeConfig } from '@/hooks/use-config';
import { GroupedMenus, MenuItem } from '@/lib/menus';
import { cn } from '@/lib/utils';
import { useMount } from '@/hooks/use-mount';

const DropdownMenu = ({ items }: { items: GroupedMenus[] }) => {

    const [openPaths, setOpenPaths] = useState<string[]>([]);
    const timeouts = useRef<Record<string, NodeJS.Timeout | null>>({});
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const path = usePathname();
    const isMount = useMount();

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
            const isActive = isActivePath(item.path) || (item.children && item.children.some((subItem) => isActivePath(subItem.path)));

            const LucideIcon = Icons[item.icon as keyof typeof Icons] as React.ElementType;

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
                            item.path && "p-0"

                        )}
                    >
                        {item.path ? (
                            <Link href={item.path} className="flex gap-2 [&>svg]:size-4 items-center w-full p-2" onClick={() => setOpenPaths([])}>
                                <LucideIcon />
                                <span>{item.name}</span>
                            </Link>
                        ) : (
                            <div className="flex gap-2 [&>svg]:size-5 w-full">
                                <LucideIcon />
                                <span>{item.name}</span>
                            </div>
                        )}
                        {item.children && item.children.length > 0 && (level === 0 ? <Icons.ChevronDown size={16} /> : <Icons.ChevronRight size={16} />)}
                    </button>

                    {item.children && item.children.length > 0 && (
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute min-w-56 bg-background shadow-lg border rounded-lg p-1 z-50 space-y-1  ${getMenuPosition(level, currentPath)}`}
                                >
                                    {renderMenuItems(item.children, currentPath, level + 1)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            );

        })
    };

    const renderGroups = (menus: GroupedMenus[], path = "", level = 0) => {
        return menus.map((item, index) => {
            const currentPath = `${path}-${index}`;
            const isOpen = isPathOpen(currentPath);

            const isActive = item.modules && item.modules.some((subItem) => isActivePath(subItem.path))

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
                        )}
                    >
                        <div className="flex gap-2 [&>svg]:size-5 w-full">
                            <span>{item.groupName}</span>
                        </div>
                        {item.modules && (level === 0 ? <Icons.ChevronDown size={16} /> : <Icons.ChevronRight size={16} />)}
                    </button>

                    {item.modules && (
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute min-w-56 bg-background shadow-lg border rounded-lg p-1 z-50 space-y-1  ${getMenuPosition(level, currentPath)}`}
                                >
                                    {renderMenuItems(item.modules, currentPath, level + 1)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            )
        })
    }

    if (!isMount) return null;

    return <nav className="flex space-x-4">{renderGroups(items)}</nav>;
};

const TenantNavbar = (({ menus }: { menus: GroupedMenus[] }) => {
    const [config] = themeConfig();
    return (
        <div className={cn("flex items-center px-8", { "container mx-auto": config.content === 'compact' })}>
            <DropdownMenu items={menus} />
        </div>
    );
})

export default TenantNavbar;