// components/server/Guard.tsx

"use server";

import { auth } from "@/auth";
import { getMyPermissions } from "@/utils/guard";
import { ReactNode } from "react";

interface GuardProps {
  permissions: string[];
  children: ReactNode;
}

export default async function Guard({ permissions, children }: GuardProps) {
   
    const myPermissions = await getMyPermissions();

  const hasPermissions = permissions.every(permission =>
    myPermissions.some((x: { name: string; }) => x.name === permission)
  );

  if (!hasPermissions) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}