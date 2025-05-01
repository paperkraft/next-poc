'use client'

import LandingPage from "./landing";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const route = useRouter();
  const { status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('✅ Service Worker registered:', reg);
        })
        .catch(err => {
          console.error('❌ Service Worker registration failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      route.replace("/dashboard");
    }
  }, [status, route]);

  if (!isClient) return null;

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <LandingPage />;
  }

  return null;
}