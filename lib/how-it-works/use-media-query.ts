'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook.
 *
 * Returns `defaultValue` during server render and the *real* match value only
 * after hydration, which keeps the mobile-first fallback markup identical
 * between server and client (no hydration mismatches).
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}