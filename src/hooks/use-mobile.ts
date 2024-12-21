"use client";
import { useEffect, useState } from "react";

export function useIsMobile() {
  const MOBILE_BREAKPOINT = 768;
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );
    setMatches(mediaQueryList.matches);
    const handleMatchChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    mediaQueryList.addEventListener("change", handleMatchChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleMatchChange);
    };
  }, []);

  return matches;
}
