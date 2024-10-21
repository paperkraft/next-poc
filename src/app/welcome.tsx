'use client';
import LeftSidebar from "@/components/custom/layout/LeftSidebar";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";

export default function WelcomePage() {
  const { data: session } = useSession();
  const mounted = useMounted();
  const user = session?.user;

  return (
    mounted &&
    <LeftSidebar>
      <div> Welcome, {user?.name ?? user?.email}  </div>
    </LeftSidebar>
  )
}