"use client";
import React, { useEffect } from "react";
import {
  BellIcon,
  PowerIcon,
  Settings2Icon,
  UserIcon
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeWrapper } from "./theme-wrapper";

const UserAction = () => {
  const { data } = useSession();
  const user = data && data?.user;
  const initials = user && user?.name?.split(' ').map((word: any[]) => word[0]).join('').toUpperCase();

  // shortcut key to logout ctrl + q
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        localStorage.removeItem("user");
        signOut({ redirect: false });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSignOut = async () => {
    sessionStorage.clear();
    await signOut({ callbackUrl: "/" });
  };

  const RenderUserInfo = () => {
    return (
      <>
        <Avatar className="size-8 border p-0.5 rounded-lg">
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

  return (
    <React.Fragment>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-8 border p-0.5 rounded-lg cursor-pointer">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="rounded-lg">{initials ?? "UN"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className={cn("w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg mr-2")}>
            <ThemeWrapper>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <RenderUserInfo />
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup className="space-y-1">

                {
                  options.map((item) => (
                    <DropdownMenuItem key={item.label} asChild>
                      <Link href={item.url} className="flex flex-1 items-center cursor-pointer hover:!text-primary">
                        {item.icon && <item.icon className="size-4 mr-2"/>}{item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))
                }

              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex text-sm hover:bg-accent text-primary" asChild>
                <Button onClick={handleSignOut} variant={'ghost'} className="flex w-full px-2">
                  <PowerIcon />Logout
                  <DropdownMenuShortcut>Ctrl+q</DropdownMenuShortcut>
                </Button>
              </DropdownMenuItem>
            </ThemeWrapper>


          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </React.Fragment>
  );
};

export default UserAction;
