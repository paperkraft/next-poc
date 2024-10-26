'use client'
import LandingPage from "./landing";
import WelcomePage from "./welcome";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  console.log("Status", status);

  switch (status) {
    case "loading":
      return (
        <div className="flex justify-center items-center w-full h-screen">
          <span className="flex items-center" aria-live="polite">
            <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            Home Loading...
          </span>
        </div>
      );

    case "authenticated":
      return <WelcomePage />;

    case "unauthenticated":
      return <LandingPage />;

    default:
      return null
  }
}