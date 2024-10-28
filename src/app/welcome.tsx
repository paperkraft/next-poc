"use client";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function WelcomePage() {
  const mounted = useMounted();
  const route = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (mounted && status !== "authenticated") {
      route.refresh();
    }
  }, [mounted, status, route]);

  return (
    mounted && user &&
    <div>
      <p>Welcome, {user?.name ?? user?.email}</p>
      <p>Your Unique Id: {user?.id ?? ""}</p>
    </div>
  );
}
