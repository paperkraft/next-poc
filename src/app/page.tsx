"use client";
import { useSession } from "next-auth/react";
import LandingPage from "./landing";
import WelcomePage from "./welcome";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return <WelcomePage />;
  } else {
    return <LandingPage />;
  }
}
