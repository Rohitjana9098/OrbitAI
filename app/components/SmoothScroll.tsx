'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect users who prefer reduced motion and fall back to native scrolling.
    const mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    if (mediaQuery?.matches) return;

    // Instantiate Lenis for buttery smooth scrolling across the entire website.
    // Options below are validated against the installed Lenis v1.3.x API.
    const lenis = new Lenis({
      // Use the classic expo-out feel (duration + easing) for wheel scrolling.
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
      // We drive the animation loop manually below via requestAnimationFrame.
      // autoRaf must stay false or Lenis would start a second, competing loop.
      autoRaf: false,
      // Lenis v1.3 respects prefers-reduced-motion itself; our early return
      // above already covers the "reduce" case, so keep the default.
      respectReducedMotion: true,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Smooth anchor navigation handler
    const HEADER_OFFSET = -88;

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const samePage =
        anchor.origin + anchor.pathname ===
        window.location.origin + window.location.pathname;
      if (!samePage) return;

      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const el = document.querySelector(hash);
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, {
        offset: HEADER_OFFSET,
        duration: 1.2,
      });
    }

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  return <>{children}</>;
}
