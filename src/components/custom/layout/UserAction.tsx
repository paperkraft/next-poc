"use client";
import React, { useEffect } from "react";
import {
  CircleUserRound,
  PowerIcon,
  Settings,
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

const UserAction = () => {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();

  // shortcut key to logout ctrl + q
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        localStorage.removeItem("user");
        signOut({redirect: false});
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

  const logout = () => {
    signOut({ redirect: false });
    localStorage.removeItem("user");
  };

  return (
    <React.Fragment>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleUserRound className="w-5 h-5 text-primary-foreground dark:text-white cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={cn("w-56 mt-4 mr-1 [&_svg]:w-5 [&_svg]:stroke-[1.5] [&_svg]:mr-2 [&_svg]:h-5")}>
            
            <DropdownMenuLabel className="flex items-center">
              {
                session?.user?.email.includes('vishal') 
                ? <Image src={"/sv.svg"} width={38} height={38} alt="user" />
                : <AvatarIcon className="h-10 w-10"/>
              }
              <span className="flex flex-col ml-4 overflow-ellipsis">
                <span>{session?.user?.name ?? "Vishal Sannake"}</span>
                <span className={cn("text-muted-foreground text-xs",{
                  "truncate w-2/3": Number(session?.user?.email?.length) >= 23
                })}>
                  {session?.user?.email ?? "vishal.sannake@akronsystems.com"}
                </span>
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup className="space-y-1">

              <li className="flex text-sm p-2 group hover:bg-accent">
                <Link href={'/profile'} className="flex w-full">
                <UserIcon /> Profile
                </Link>
              </li>

              <li className="flex text-sm p-2 group hover:bg-accent">
                <Link href={'#'} className="flex w-full">
                  <Settings /> Settings
                </Link>
              </li>

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <li className="flex text-sm hover:bg-accent text-primary">
              <Button onClick={logout} variant={'ghost'} className="flex w-full px-2">
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
