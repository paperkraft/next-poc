'use client';
import { useMounted } from "@/hooks/use-mounted";
import { LoaderCircleIcon } from "lucide-react";
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
    mounted && user
    ? <div> 
        <p>Welcome, {user?.name ?? user?.email}</p>
        <p>Your Unique Id: {user?.id ?? ""}</p>
      </div>
    : <div className="flex justify-center items-center w-full h-full">
        <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin"/> Loading...
      </div>
  )
}