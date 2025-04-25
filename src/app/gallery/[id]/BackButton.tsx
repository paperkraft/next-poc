"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export default function BackButton() {
  const router = useRouter();
  const mounted = useMounted();
  return (
    mounted &&
    <Button variant="outline" onClick={() => router.back()} className="mt-4">
      Back
    </Button>
  );
}