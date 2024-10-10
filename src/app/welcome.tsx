'use client';
import AppLayout from "@/components/custom/layout/AppLayout";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";

export default function WelcomePage() {
  const { data: session } = useSession();
  const mounted = useMounted();
  const user = session?.user;

  return (
    mounted &&
    <AppLayout>
      <div> Welcome, {user?.name ?? user?.email}  </div>
    </AppLayout>
  )
}