'use client';
import { useMounted } from "@/hooks/use-mounted";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function WelcomePage() {
  const mounted = useMounted();
  const route = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (mounted && !user) {
      route.refresh()
    }
  }, [mounted, user])

  return (
    <React.Fragment>
      {
        mounted && user
          ? <div>
            <p>Welcome, {user?.name ?? user?.email}</p>
            <p>Your Unique Id: {user?.id ?? ""}</p>
          </div>
          : <div className="flex justify-center items-center w-full h-screen">
            <span className="flex items-center">
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </span>
          </div>
      }
    </React.Fragment>
  )
}