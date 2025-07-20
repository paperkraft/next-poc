'use client'

import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
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
import { themeConfig } from "@/hooks/use-config";
import { UserActions } from "@/config/user-action";
import { ThemeWrapper } from "@/components/layout/theme-wrapper";
import { LogoutDialog } from "../common/LogoutDialog";

const SidebarFooterContent = React.memo(() => {
    const { data } = useSession();
    const [config] = themeConfig();
    const { isMobile, toggleSidebar } = useSidebar();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const isDual = (config.layout === "collapsed" || config.layout === "dual-menu") && !isMobile;

    const user = data && data?.user;
    const slug = data?.user?.slug ?? "admin";
    const initials = user && user?.name?.split(' ').map((word: any[]) => word[0]).join('').toUpperCase();

    const logout = () => setIsLoggingOut(true);

    // shortcut key to logout ctrl + q
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                logout();
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const RenderUserInfo = () => {
        return (
            <>
                <Avatar className={cn("border p-0.5 rounded-lg", isDual && "size-8")}>
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">{initials ?? "UN"}</AvatarFallback>
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

    const handleClose = () => {
        if (isMobile) {
            toggleSidebar();
        }
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg"
                                className={cn("data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus-within:!ring-primary p-0",
                                    isDual && "size-8"
                                )}
                            >
                                <RenderUserInfo />
                                <EllipsisVerticalIcon className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                            className={cn("w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:size-4 [&_svg]:mr-2 mb-2")}
                        >
                            <ThemeWrapper>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <RenderUserInfo />
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    {UserActions.map((item) => (
                                        <DropdownMenuItem key={item.label} asChild className="cursor-pointer" onClick={handleClose}>
                                            <Link href={`/${slug}${item.url}`} className="flex flex-1 items-center hover:!text-primary">
                                                {item.icon && <item.icon />}{item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={logout} className="cursor-pointer hover:!text-primary">
                                    {isLoggingOut ? <span>Logging out...</span> : <><LogOutIcon /> Log out</>}
                                </DropdownMenuItem>

                            </ThemeWrapper>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <LogoutDialog
                open={isLoggingOut}
                onOpenChange={setIsLoggingOut}
            />
        </>
    )
});

SidebarFooterContent.displayName = 'SidebarFooterContent';
export default SidebarFooterContent