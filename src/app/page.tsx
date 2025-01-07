'use client'
import LandingPage from "./landing";
import WelcomePage from "./welcome";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import { useMounted } from "@/hooks/use-mounted";

export default function Home() {
  const { status } = useSession();
  const mounted = useMounted();
 
  switch (status) {
    case "loading":
      return mounted && <Loading/>;

    case "authenticated":
      return mounted && <WelcomePage />;

    case "unauthenticated":
      return mounted && <LandingPage />;

    default:
      return null;
  }
}