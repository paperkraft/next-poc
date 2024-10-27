'use client'
import LandingPage from "./landing";
import Loading from "./loading";
import WelcomePage from "./welcome";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  switch (status) {
    case "loading":
      return <Loading/>;

    case "authenticated":
      return <WelcomePage />;

    case "unauthenticated":
      return <LandingPage />;

    default:
      return <Loading/>;
  }
}