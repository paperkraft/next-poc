'use client';
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import * as React from "react";
import { BookTextIcon, GraduationCap, Home, ImageIcon, MonitorCogIcon, UniversityIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SidebarMenu() {
    const path = usePathname();
    const classList =['group', 'flex', 'justify-between', 'items-center', 'rounded-md', 'p-2', 'text-sm', 'font-normal', 'leading-6', 'text-primary', 'hover:bg-gray-100', 'dark:text-primary', 'dark:hover:dark:bg-slate-800']
    
    return (
        <ScrollArea className="md:w-56 border-0 md:border-r h-[calc(100vh-63px)]">
            <nav className="md:px-4 sm:p-0 mt-5 last:mb-10">
                <ul role="list" className="flex flex-1 flex-col">
                    <p className={`mx-4 mb-3 text-xs text-left tracking-wider text-slate-500`}>Home</p>
                    <li>
                        <Link href={'/dashboard'} className={cn(classList, {"bg-gray-100 dark:bg-slate-800": path === '/dashboard' || path.includes('dashboard')})}>
                            <span className="flex">
                                <Home size={20} className="stroke-[1.5] mr-1" />
                                Dashboard
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/gallery'} className={cn(classList, {"bg-gray-100 dark:bg-slate-800": path === '/gallery' || path.includes('gallery')})}>
                            <span className="flex">
                                <ImageIcon size={20} className="stroke-[1.5] mr-1" />
                                Gallery
                            </span>
                        </Link>
                    </li>
                </ul>
                <ul role="list" className="flex flex-1 flex-col mt-10">
                    <p className={`mx-4 mb-3 text-xs text-left tracking-wider text-slate-500`}>Master</p>
                    <li>
                        <Link href={'/college'} className={cn(classList, {"bg-gray-100 dark:bg-slate-800": path === '/college'})}>
                            <span className="flex">
                                <UniversityIcon size={20} className="stroke-[1.5] mr-1" />
                                College
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/access-control'} className={cn(classList, {"bg-gray-100 dark:bg-slate-800": path === '/access-control'})}>
                            <span className="flex">
                                <MonitorCogIcon size={20} className="stroke-[1.5] mr-1" />
                                Access Control
                            </span>
                        </Link>
                    </li>
                </ul>
                <ul role="list" className="flex flex-1 flex-col mt-10">
                    <p className={`mx-4 mb-3 text-xs text-left tracking-wider text-slate-500`}>Module</p>
                    <li>
                        <Link href={'/student'} className={cn(classList, {"bg-gray-100 dark:bg-slate-800": path === '/student'})}>
                            <span className="flex">
                                <GraduationCap size={20} className="stroke-[1.5] mr-1" />
                                Student
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </ScrollArea>
    );
}
