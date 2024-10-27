"use client";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loading from "./loading";

export default function WelcomePage() {
  const mounted = useMounted();
  const route = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      route.refresh();
    }
  }, [mounted, status, route]);

  if (status === "loading" || !user) {
    return <Loading />;
  }

  return (
    <div>
      <p>Welcome, {user?.name ?? user?.email}</p>
      <p>Your Unique Id: {user?.id ?? ""}</p>
    </div>
  );
}
