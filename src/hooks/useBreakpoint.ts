import { token } from "styled-system/tokens";
import { useEffect, useRef, useState } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

interface BreakpointOptions {
  onChange?: (matches: boolean) => void;
}

function getQuery(breakpoint: Breakpoint) {
  return `(min-width: ${token(`breakpoints.${breakpoint}`)})`;
}

export function useBreakpointAbove(
  breakpoint: Breakpoint,
  options?: BreakpointOptions,
) {
  const onChangeRef = useRef(options?.onChange);
  useEffect(() => {
    onChangeRef.current = options?.onChange;
  }, [options?.onChange]);

  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(getQuery(breakpoint)).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(getQuery(breakpoint));
    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
      onChangeRef.current?.(e.matches);
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return matches;
}

export function useBreakpointBelow(
  breakpoint: Breakpoint,
  options?: BreakpointOptions,
) {
  const onChangeRef = useRef(options?.onChange);
  useEffect(() => {
    onChangeRef.current = options?.onChange;
  }, [options?.onChange]);

  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia(getQuery(breakpoint)).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(getQuery(breakpoint));
    function handleChange(e: MediaQueryListEvent) {
      const below = !e.matches;
      setMatches(below);
      onChangeRef.current?.(below);
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return matches;
}
