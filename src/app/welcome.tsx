"use client";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import FormBuilder from "./builder/screens/form-builder";

export default function WelcomePage() {
  const mounted = useMounted();
  const route = useRouter();
  const { data, status } = useSession();
  

  useEffect(() => {
    if (mounted && status !== "authenticated") {
      route.refresh();
    }
  }, [mounted, status, route]);

  return (
    mounted && data &&
    <div>
      <div className="hidden">
        <p>Welcome, {data?.user?.name ?? data?.user?.email}</p>
        <p>Your Unique Id: {data?.user?.id ?? ""}</p>
      </div>
      <FormBuilder/>
    </div>
  );
}
