"use client";
import { useMount } from '@/hooks/use-mount';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function WelcomePage() {
  const isMount = useMount();
  const route = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (isMount && status !== "authenticated") {
      route.refresh();
    }
  }, [isMount, status, route]);

  // useEffect(() => {
  //   async function fetchDeviceInfo() {
  //     console.log('Device Info API');
  //     try {
  //       const response = await fetch('/api/device-info');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch device info');
  //       }
  //       const data = await response.json();
  //       console.log('Device Info:', data);
  //     } catch (error) {
  //       console.error('Error fetching device info:', error);
  //     }
  //   }

  //   fetchDeviceInfo();
  // }, []);

  return (
    isMount && data &&
    <>
      <div>
        <p>Welcome, {data?.user?.name ?? data?.user?.email}</p>
        <p>Your Unique Id: {data?.user?.id ?? ""}</p>
      </div>
    </>
  );
}
