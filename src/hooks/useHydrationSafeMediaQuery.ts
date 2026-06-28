"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

/**
 * Media query hook that avoids hydration mismatch.
 * Returns false on server and initial client render, then the actual value after mount.
 */
export function useHydrationSafeMediaQuery(query: { maxWidth?: number; minWidth?: number }) {
  const [mounted, setMounted] = useState(false);
  const matches = useMediaQuery(query);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted ? matches : false;
}
