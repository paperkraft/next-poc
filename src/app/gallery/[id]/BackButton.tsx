"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMount } from '@/hooks/use-mount';

export default function BackButton() {
  const router = useRouter();
  const isMount = useMount();
  return (
    isMount &&
    <Button variant="outline" onClick={() => router.back()} className="mt-4">
      Back
    </Button>
  );
}