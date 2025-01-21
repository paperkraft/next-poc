"use client";
import React, { useEffect } from "react";
import {
  BellIcon,
  CircleUserRound,
  EllipsisVerticalIcon,
  PowerIcon,
  Settings,
  Settings2Icon,
  UserIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserAction = () => {
  const { setTheme, resolvedTheme } = useTheme();
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
        <Avatar className="size-8 border p-0.5">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="rounded-full">{initials ?? "UN"}</AvatarFallback>
        </Avatar>
        <div className="grid text-left text-sm leading-tight">
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
            <Avatar className="size-8 border p-0.5 cursor-pointer">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="rounded-full">{initials ?? "UN"}</AvatarFallback>
            </Avatar>
            
            {/* <CircleUserRound className="size-5 cursor-pointer" /> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={cn("w-56 mt-4 mr-1")}>

            <DropdownMenuLabel className="flex gap-1 items-center cursor-pointer">
              <RenderUserInfo />
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup className="space-y-1">

              {
                options.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.url} className="flex flex-1 items-center cursor-pointer">
                      {item.icon && <item.icon className="size-4 mr-1"/>}{item.label}
                    </Link>
                  </DropdownMenuItem>
                ))
              }

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <li className="flex text-sm hover:bg-accent text-primary">
              <Button onClick={handleSignOut} variant={'ghost'} className="flex w-full px-2">
                <PowerIcon />Logout
                <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
              </Button>
            </li>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </React.Fragment>
  );
};

export default UserAction;
