'use client';
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
  const route = useRouter();
  const mounted = useMounted();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (mounted && !user) {
      route.refresh()
    }
  }, [mounted, user])

  return (
    mounted && <div> Welcome, {user?.name ?? user?.email}  </div>
  )
}