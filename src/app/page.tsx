'use client'
import { useMounted } from "@/hooks/use-mounted";
import LandingPage from "./landing";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { status } = useSession();
  const route = useRouter();
  const mounted = useMounted();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (status === "authenticated" && mounted) {
      setIsAuthenticated(true);
      route.push("/dashboard");
    }
  }, [status, mounted, route, setIsAuthenticated]);

  if (!mounted) {
    return null;
  }

  switch (status) {
    case "loading":
      return <Loading />;

    case "unauthenticated":
      return <LandingPage />;

    default:
      return null;
  }
}