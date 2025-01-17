'use client'
import { logAuditAction } from "@/lib/audit-log";
import { BellIcon, EllipsisVerticalIcon, LogOutIcon, Settings2Icon, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const options = [
    {
        label: 'Profile',
        url: '/profile',
        icon: UserIcon
    },
    {
        label: 'Setting',
        url: '/profile-settings',
        icon: Settings2Icon
    },
    {
        label: 'Notifications',
        url: '/notifications',
        icon: BellIcon
    },
]

const SidebarFooterContent = React.memo(() => {
    const { data } = useSession();
    const user = data && data?.user;
    const initials = user && user?.name?.split(' ').map((word: any[]) => word[0]).join('').toUpperCase();

    const logout = async () => {
        await logAuditAction('logout', 'auth/signout', { user: `${user?.name}` }, user.id);
        signOut({ redirect: false });
    }

    // shortcut key to logout ctrl + q
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                localStorage.removeItem("user");
                localStorage.removeItem("groups");
                localStorage.removeItem("menus");
                signOut({ redirect: true, redirectTo:'/signin' });
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const RenderUserInfo = () => {
        return (
            <>
                <Avatar className="size-8 border p-0.5">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="rounded-full">{initials ?? "UN"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                        {user?.name}
                    </span>
                    <span className="truncate text-xs">
                        {user?.email}
                    </span>
                </div>
            </>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <RenderUserInfo />
                            <EllipsisVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className={cn("w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:size-4 [&_svg]:stroke-[1.5] [&_svg]:mr-2 mb-2")}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <RenderUserInfo />
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            {
                                options.map((item) => (
                                    <DropdownMenuItem key={item.label}>
                                        <Link href={item.url} className="flex flex-1 items-center">
                                            {item.icon && <item.icon />}{item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                            <LogOutIcon /> Log out
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
});

SidebarFooterContent.displayName = 'SidebarFooterContent';
export default SidebarFooterContent