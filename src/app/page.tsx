'use client'
import { useMounted } from "@/hooks/use-mounted";
import LandingPage from "./landing";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const route = useRouter();
  const mounted = useMounted();

  switch (status) {
    case "loading":
      return mounted && <Loading />;

    case "authenticated":
      return mounted && route.push("/dashboard");

    case "unauthenticated":
      return mounted && <LandingPage />;

    default:
      return null;
  }
}