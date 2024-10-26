'use client';
import { useMounted } from "@/hooks/use-mounted";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="flex items-center" aria-live="polite">
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.name ?? user?.email}</p>
      <p>Your Unique Id: {user?.id ?? ""}</p>
    </div>
  );
}