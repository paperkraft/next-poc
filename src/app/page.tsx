'use client'
import LandingPage from "./landing";
import WelcomePage from "./welcome";
import Loading from "./loading";
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
      return null;
  }
}